//import TronWeb from "tronweb";
import { getPowerupJSON, getProfileJSON } from "./consts/NftData";

import { Buffer } from 'buffer';
window.Buffer = Buffer;

export const delay = async (ms) =>
    await new Promise((resolve) => setTimeout(resolve, ms));

export const storeValue = (key, val) => {
    window.localStorage.setItem(key, JSON.stringify(val));
};

export const getValue = (key) => {
    const value = window.localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
};

const trongridBaseAPI = "https://nile.trongrid.io";
const PROFILES_NFT_CONTRACT = "TFeL28QUB6e9tF3DzBSZcLcBuPoGW5PHxQ" // Adventures Profiles (TADP)
const POWERUPS_NFT_CONTRACT = "TPKriX1NzJhvWkDYbHy1E3zNoyzdhWfJGw" // Adventures Powers (TAPOW)

function useTronWeb() {
    return new window.TronWeb({
        fullHost: trongridBaseAPI,
        privateKey: "f3d2bb4a4b2b71b3daad841ca8702afa5496573da4eda7bdd1300dce0d3f2ebc"        
    });
}

const tronWeb = useTronWeb() //window.tronWeb

export async function initTron() {
    const res = await window.tronLink.request({
        method: "tron_requestAccounts",
    });
    
    if (res) {
        getTronWeb()
        return res
    }
    else {
        return null
    }
}

export function getTronWeb() {
    // Obtain the tronweb object injected by tronLink
    var obj = setInterval(async () => {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
            clearInterval(obj);
            console.log("tronWeb successfully detected!");
        }
    }, 100);
}

async function getBalance() {
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

export async function getWalletDetails() {
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
                link: "true",
            };
            return {
                connected: true,
                details,
            };
        } else {
            //we have wallet but not logged in
            const details = {
                name: "none",
                address: "none",
                balance: 0,
                frozenBalance: 0,
                network: "none",
                link: "false",
            };
            return {
                connected: false,
                details,
            };
        }
    } else {
        //wallet is not detected at all
        return {
            connected: false,
            details: null,
        };
    }
}

async function getTokenInfo(contractAddr, holderAddr) {
    let contract = await tronWeb.contract().at(contractAddr);
    let decimals = 0;
    //let isFungible = false;
    let type = "NON_FUNGIBLE_UNIQUE";
    try {
        decimals = await contract.decimals().call();
        type = "FUNGIBLE_COMMON";
    } catch (error) {
        //isFungible = false;
    }

    try {
        let name = await contract.name().call();
        let symbol = await contract.symbol().call();
        let _balance = await contract.balanceOf(holderAddr).call();

        let balance = 0;
        try {
            balance = _balance.toNumber();
        } catch (error) {
            let b = BigInt(_balance);
            balance = tronWeb
                .BigNumber(b)
                .shiftedBy(-1 * decimals)
                .toNumber();
        }

        return {
            address: contractAddr,
            name,
            symbol,
            decimals,
            balance,
            type,
        };
    } catch (error) {
        console.log(
            symbol,
            "trigger smart contract error",
            contractAddr,
            error
        );
        return {};
    }
}

async function getNftInfoByOwnerIndex(contractAddr, holderAddr, index) {
    let contract = await tronWeb.contract().at(contractAddr);
    try {
        let tokenId = await contract
            .tokenOfOwnerByIndex(holderAddr, index)
            .call();
        let tokenUri = await contract.tokenURI(tokenId).call();
        let metadata = await (await fetch(tokenUri)).json();
        return {
            address: contractAddr,
            tokenId: tokenId.toString(),
            tokenUri,
            metadata,
        };
    } catch (error) {
        console.log("error getting nft", error);
        return {};
    }
}

async function getNftsFromAccount(userAddress, contractAddress) {
    const nfts = await getTokenInfo(contractAddress, userAddress);

    const reqNftInfos = Array(nfts.balance)
        .fill(0)
        .map((v, index) =>
            getNftInfoByOwnerIndex(contractAddress, userAddress, index)
        );

    const nftInfos = await Promise.all(reqNftInfos);
    const accountNfts = nftInfos.map(t => {
        const {name, symbol, type} = nfts;
        return { name, symbol, type, ...t }
    })

    return accountNfts
}

export async function getGameProfileTokens(userAddress) {
    const accountProfiles = await getNftsFromAccount(userAddress, PROFILES_NFT_CONTRACT)
    return accountProfiles
}

export async function getProfilePowerUps(tbaAddress) {
    const profilePowerUps = await getNftsFromAccount(tbaAddress, POWERUPS_NFT_CONTRACT)
    return profilePowerUps
}

async function uploadJson(tokenId, data = null) {
    const content = data === null ? getProfileJSON(tokenId) : getPowerupJSON(tokenId, data);

    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT
    const options = {
        method: 'POST',
        headers: {Authorization: `Bearer ${JWT}`, 'Content-Type': 'application/json'},
        body: `{"pinataOptions":{"cidVersion":1},"pinataMetadata":{"name":"${pseudoRandId()}.json"},"pinataContent":${JSON.stringify(content)}}`
    };

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options);
        const { IpfsHash } = await response.json();
        const tokenUri = `https://${IpfsHash}.ipfs.dweb.link`;
        console.log(tokenUri)
        return tokenUri;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// use index to assign tokenid when minting multiple tokens in one request
async function mintNFT(userAddress, contractAddress, data = null, index = 0) {
    const contract = await tronWeb.contract().at(contractAddress);
    
    const totalSupply = await contract.totalSupply().call();
    const tokenId = parseInt(totalSupply) + 1 + index;

    const tokenUri = await uploadJson(tokenId, data)
    if (tokenUri === null) {
        return {
            error: true,
			result: "UPLOAD_ERROR"
        }
    }

    try {
        const result = await contract
            .mintWithTokenURI(userAddress, tokenId, tokenUri)
            .send({
                feeLimit: 100_000_000
            });
        return {
            error: false,
            result: "SUCCESS",
            txid: result,
            tokenId
        }
    } catch (error) {
        console.log(error)
        return {
            error: true,
			result: "MINTING_ERROR"
        }
    }
}

export async function mintProfile(userAddress) {
    const result = await mintNFT(userAddress, PROFILES_NFT_CONTRACT);

    if (!result.error) {
        const tbaAddress = await tbaCreateAccount(PROFILES_NFT_CONTRACT, result.tokenId);
        console.log(tbaAddress);
    }

    return result;
}

export async function mintPowerUp(tbaAddress, data, index = 0) {
    const result = await mintNFT(tbaAddress, POWERUPS_NFT_CONTRACT, data, index);
    return result;
}

// TBA constants
const MAINNET_ID = 3448148188;
const SALT = "0x1000000000000000000000000000000000000000000000000000000000000000";
const REGISTRY_CONTRACT_ADDRESS = "TE4xFtwAikSNhVpk7DcDXzooEBhy2eXE3i";
const IMPLEMENTATION_CONTRACT_ADDRESS = "TYUBDqFuVxcxEJAYhC7FwwTrtffijWq6vh";

export async function tbaCreateAccount(tokenContract, tokenId) {
    const contract = await tronWeb.contract().at(REGISTRY_CONTRACT_ADDRESS);

    try {
        const address = await contract.createAccount(
            IMPLEMENTATION_CONTRACT_ADDRESS,
            SALT,
            MAINNET_ID,
            tokenContract,
            tokenId
        ).send({
            feeLimit: 1_000_000_000,
        });

        const addressBase58 = tronWeb.address.fromHex(address);
        return addressBase58;
    } catch (error) {
        console.log("smartcontract error", error);
        return null;
    }
}

export async function tbaGetAddress(tokenContract, tokenId) {
    const contract = await tronWeb.contract().at(REGISTRY_CONTRACT_ADDRESS);
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

// id string for tokenUri filenames
function pseudoRandId() {
    const CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let autoId = "";

    for (let i = 0; i < 10; i++) {
        autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
}