import axios from "axios";
import TronWeb from "tronweb";
import { REGISTRY_ABI, REGISTRY_CONTRACT_ADDRESS } from "../constants/registry";
import { IMPLEMENTATION_ABI, IMPLEMENTATION_CONTRACT_ADDRESS } from "../constants/account";

const trongridBaseAPI = "https://nile.trongrid.io";
const tronscanBaseAPI = "https://nileapi.tronscan.org";

function useTronWeb() {
    return new TronWeb({
        fullHost: trongridBaseAPI,
        privateKey: process.env.NEXT_PUBLIC_TRONGRID_PK        
    });
}

const tronWeb = useTronWeb() //window.tronWeb

export function getTronWeb(){
  // Obtain the tronweb object injected by tronLink 
  var obj = setInterval(async ()=>{
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(obj)
        console.log("tronWeb successfully detected!")
    }
  }, 100)
}

export const getBalance = async () => {
    //if wallet installed and logged , getting TRX token balance
    if (window.tronLink.tronWeb && window.tronLink.tronWeb.ready) {
        let walletBalances = await window.tronLink.tronWeb.trx.getAccount(
            window.tronLink.tronWeb.defaultAddress.base58
        );
        return walletBalances;
    } else {
        return 0;
    }
}

export const getWalletDetails = async () => {
    if (window.tronLink.tronWeb) {
        //checking if wallet injected
        if (window.tronLink.tronWeb.ready) {
            let tempBalance = await getBalance();
            let tempFrozenBalance = 0;

            if (!tempBalance.balance) {
                tempBalance.balance = 0;
            }

            //checking if any frozen balance exists
            if (
                !tempBalance.frozen &&
                !tempBalance.account_resource.frozen_balance_for_energy
            ) {
                tempFrozenBalance = 0;
            } else {
                if (
                    tempBalance.frozen &&
                    tempBalance.account_resource.frozen_balance_for_energy
                ) {
                    tempFrozenBalance =
                        tempBalance.frozen[0].frozen_balance +
                        tempBalance.account_resource.frozen_balance_for_energy
                            .frozen_balance;
                }
                if (
                    tempBalance.frozen &&
                    !tempBalance.account_resource.frozen_balance_for_energy
                ) {
                    tempFrozenBalance = tempBalance.frozen[0].frozen_balance;
                }
                if (
                    !tempBalance.frozen &&
                    tempBalance.account_resource.frozen_balance_for_energy
                ) {
                    tempFrozenBalance =
                        tempBalance.account_resource.frozen_balance_for_energy
                            .frozen_balance;
                }
            }

            //we have wallet and we are logged in
            const details = {
                name: window.tronLink.tronWeb.defaultAddress.name,
                address: window.tronLink.tronWeb.defaultAddress.base58,
                balance: tempBalance.balance / 1000000,
                frozenBalance: tempFrozenBalance / 1000000,
                network: window.tronLink.tronWeb.fullNode.host,
                link: 'true',
            };
            return {
                connected: true,
                details
            }
        } else {
            //we have wallet but not logged in
            const details = {
                name: 'none',
                address: 'none',
                balance: 0,
                frozenBalance: 0,
                network: 'none',
                link: 'false',
            };
            return {
                connected: false,
                details
            }
        }
    } else {
        //wallet is not detected at all
        return {
            connected: false,
            details: null
        }
    }
}

export async function getAccountInfo(address) {
    let response = null;

    try {
        const res = await axios.get(`${trongridBaseAPI}/v1/accounts/${address}`);
        response = res.data;
        
    } catch (err) {
        const { message, response:{status} } = err;
		console.log(`request error in %c ${"getAccountInfo"}`, 'font-weight:900');
		console.log(status, message);
    }

    return response;
}


export function formatAssetDataFromTronscan(data) {
    const type = data.tokenType === "trc721" ? 
        "NON_FUNGIBLE_UNIQUE":
        "FUNGIBLE_COMMON";

    return {
        type,
        name: data.tokenName,
        symbol: data.tokenAbbr, 
        address: data.tokenId,
        decimals: data.tokenDecimal,
        balance: data.quantity, //data.balance(evm str)
        standard: data.tokenType,
        thumb: data.tokenLogo
    }
}

export async function getAccountTokensREST(address) {
    let response = null;

    try {
        const res = await axios.get(`${tronscanBaseAPI}/api/account/tokens?address=${address}`);
        response = res.data;
        
    } catch (err) {
        const { message, response:{status} } = err;
		console.log(`request error in %c ${"getAccountTokensREST"}`, 'font-weight:900');
		console.log(status, message);
    }

    return response;
}

export async function getAccountCollectiblesREST(address) {
    let response = null;

    try {
        const res = await axios.get(`${tronscanBaseAPI}/api/account/tokens?address=${address}&show=3`);
        response = res.data;
        
    } catch (err) {
        const { message, response:{status} } = err;
		console.log(`request error in %c ${"getAccountTokensREST"}`, 'font-weight:900');
		console.log(status, message);
    }

    return response;
}

export async function getTokenInfo(contractAddr, holderAddr) {
    let contract = await tronWeb.contract().at(contractAddr);
    let decimals = 0;
    //let isFungible = false;
    let type = "NON_FUNGIBLE_UNIQUE"
    try {
        decimals = await contract.decimals().call();
        type = "FUNGIBLE_COMMON"
    } catch (error) {
        //isFungible = false;
    }

    try {
        let name = await contract.name().call();
        let symbol = await contract.symbol().call();
        let _balance = await contract.balanceOf(holderAddr).call();
        
        let balance = 0
        try {
            balance = _balance.toNumber()
        } catch (error) {
            let b = BigInt(_balance)
            balance = tronWeb.BigNumber(b).shiftedBy(-1*decimals).toNumber()
        }

        return {
            address: contractAddr,
            name,
            symbol,
            decimals,
            balance,
            type
        }
    } catch (error) {
        console.log(symbol, "trigger smart contract error", contractAddr,error);
        return {};
    }
}

export async function getNftInfoByOwnerIndex(contractAddr, holderAddr, index) {
    let contract = await tronWeb.contract().at(contractAddr);
    try {
        let tokenId = await contract.tokenOfOwnerByIndex(holderAddr, index).call();
        let tokenUri = await contract.tokenURI(tokenId).call();
        let metadata = await (await fetch(tokenUri)).json();
        return {
            address: contractAddr,
            tokenId: tokenId.toString(),
            tokenUri,
            metadata
        }   
    } catch (error) {
        console.log("error getting nft",error);
        return {};
    }
}

export async function getNftInfoById(contractAddr, tokenId) {
    let contract = await tronWeb.contract().at(contractAddr);
    try {
        let name = await contract.name().call();
        let symbol = await contract.symbol().call();
        let tokenUri = await contract.tokenURI(tokenId).call();
        let metadata = await (await fetch(tokenUri)).json();
        return {
            type: "NON_FUNGIBLE_UNIQUE",
            address: contractAddr,
            tokenId: tokenId.toString(),
            tokenUri,
            metadata,
            symbol,
            name
        }   
    } catch (error) {
        console.log("error getting nft",error);
        return {};
    }
}

export async function getAccountTokens(tokens, holderAddr) {
    const reqTokenInfos = tokens.map(addr => getTokenInfo(addr, holderAddr));
    const tokenInfos = await Promise.all(reqTokenInfos);

    // format nfts array to iterate easely over it
    const filterNfts = tokenInfos
        .filter(t => t.type === "NON_FUNGIBLE_UNIQUE")
        .map(({address, balance}) => {
            const arr = Array(balance).fill(0);
            return arr.map((n,index) => ({address, index}));
        })
        .flat();

    const reqNftInfos = filterNfts.map(t => getNftInfoByOwnerIndex(t.address, holderAddr, t.index));
    const nftInfos = await Promise.all(reqNftInfos);

    const accountNfts = nftInfos.map(t => {
        const {name, symbol, type} = tokenInfos.find(i => t.address === i.address);
        return { name, symbol, type, ...t }
    });
    
    return {
        accountTokens: tokenInfos.filter(t => t.type === "FUNGIBLE_COMMON"),
        accountNfts
    }
}

export async function getBalanceAddr(address) {
    const result = await tronWeb.trx.getBalance(address);
    return result;
}

// tokenbound methods
const MAINNET_ID = 3448148188;
const SALT = "0x1000000000000000000000000000000000000000000000000000000000000000"

export function isValidAddress(addr) {
    return tronWeb.isAddress(addr)
}

export function addressToHex(addr) {
    return tronWeb.address.toHex(addr)
}

export async function tbaGetAddress(tokenContract, tokenId) {
    const contract = await tronWeb.contract(REGISTRY_ABI, REGISTRY_CONTRACT_ADDRESS);
    const tid = `${tokenContract}_${tokenId}`;

    try {
        const address = await contract.account(
            IMPLEMENTATION_CONTRACT_ADDRESS,
            SALT,
            MAINNET_ID,
            tokenContract,
            tokenId
        ).call();

        const addressBase58 = tronWeb.address.fromHex(address);
        
        // verifies if there's a tba deployment for this account
        const deployment = await tronWeb.trx.getContract(addressBase58)
        const isDeployed = Object.keys(deployment).length > 0;

        return {
            address: addressBase58,
            isDeployed,
            tid
        };
    } catch (error) {
        console.log("smartcontract error", error);
        return {
            account: null,
            isDeployed: false,
            tid
        };
    }
}

export async function tbaCreateAccount(tokenContract, tokenId) {
    const contract = await tronWeb.contract(REGISTRY_ABI, REGISTRY_CONTRACT_ADDRESS);

    try {
        const address = await contract.createAccount(
            IMPLEMENTATION_CONTRACT_ADDRESS,
            SALT,
            MAINNET_ID,
            tokenContract,
            tokenId
        ).call();

        const addressBase58 = tronWeb.address.fromHex(address);
        
        // verifies if there's a tba deployment for this account
        const deployment = await tronWeb.trx.getContract(addressBase58)
        console.log("deployment", addressBase58, deployment)

        return addressBase58;
    } catch (error) {
        console.log("smartcontract error", error);
        return {};
    }
}

export async function tbaExecute(to, value, data, tbaAddress) {
    const tweb = window.tronLink.tronWeb;
    const contract = await tweb.contract(IMPLEMENTATION_ABI, tbaAddress);

    try {
        const operation = 0; // CALL
        const result = await contract.execute(to, value, data, operation)
        .send({
            feeLimit: 1_000_000_000,
        });

        return {
            result,
            transactionId: result,
            err: false,
        };
    } catch (error) {
        console.log("smartcontract error", error);
        return {
            err: true,
        };
    }
}