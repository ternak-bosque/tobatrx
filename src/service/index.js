import axios from "axios";
import TronWeb from "tronweb";
//import { REGISTRY_ABI, REGISTRY_CONTRACT_ADDRESS } from "../constants/registry";
//import { IMPLEMENTATION_ABI, IMPLEMENTATION_CONTRACT_ADDRESS } from "../constants/account";
import { getHostNetwork } from "./wallet";
import { TOKENBOUND } from "../constants/tokenbound";
import { getProfileJSON, pseudoRandId } from "../lib/myutils";


function useTronWeb() {
    const {id, trongridBaseAPI} = getHostNetwork(window.tronLink.tronWeb.fullNode.host)
    const options = {
        fullHost: trongridBaseAPI,
        privateKey: process.env.NEXT_PUBLIC_TRONGRID_PK        
    }

    if (id === "mainnet")
        options.headers = { 
            "TRON-PRO-API-KEY": process.env.NEXT_PUBLIC_TRONGRID_KEY 
        };

    return new TronWeb(options);
}

export async function getAccountInfo(address) {
    let response = null;
    const {trongridBaseAPI} = getHostNetwork(window.tronLink.tronWeb.fullNode.host)

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
    const {tronscanBaseAPI} = getHostNetwork(window.tronLink.tronWeb.fullNode.host);

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
    const {tronscanBaseAPI} = getHostNetwork(window.tronLink.tronWeb.fullNode.host);

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
    let tronWeb = useTronWeb();
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
    let tronWeb = useTronWeb();
    let contract = await tronWeb.contract().at(contractAddr);
    try {
        let tokenId = await contract.tokenOfOwnerByIndex(holderAddr, index).call();
        let _tokenId = Array.isArray(tokenId) ? tokenId[0] : tokenId; // check for tupples
        let tokenUri = await contract.tokenURI(_tokenId).call();
        let metadata = {};

        if (tokenUri.startsWith('http') || tokenUri.startsWith('ipfs')) {
            let _tokenUri = tokenUri.startsWith('ipfs') ? tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/") : tokenUri;
            try {
                metadata = await (await fetch(_tokenUri)).json();
            } catch (error) {
                console.log('error getting metadata')
            }
        }
        else {
            // try {
            //     metadata = await (await fetch(`https://ipfs.io/ipfs/${tokenUri}/${tokenId}`)).json();
            // } catch (error) {
            //     console.log('error getting metadata Q')
            // }
        }

        return {
            address: contractAddr,
            tokenId: tokenId.toString(),
            tokenUri,
            metadata
        }   
    } catch (error) {
        console.log("error getting nft",error);
        return {
            address: contractAddr,
            tokenId: 0,
            tokenUri: "",
            metadata: {}
        };
    }
}

export async function getNftInfoById(contractAddr, tokenId) {
    let tronWeb = useTronWeb();
    let contract = await tronWeb.contract().at(contractAddr);
    try {
        let name = await contract.name().call();
        let symbol = await contract.symbol().call();
        let tokenUri = await contract.tokenURI(tokenId).call();
        
        let metadata = {};
        if (tokenUri.startsWith('http') || tokenUri.startsWith('ipfs')) {
            try {
                metadata = await (await fetch(tokenUri)).json();
            } catch (error) {
                console.log('error getting metadata')
            }
        }
        else {
            console.log("bad tokenUri format", tokenUri)
        }

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
        return {
            type: "NON_FUNGIBLE_UNIQUE",
            address: contractAddr,
            tokenId: tokenId.toString(),
            tokenUr: "",
            metadata: {},
            symbol: "",
            name: ""
        }   
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

export async function getNftOwner(contractAddr, tokenId) {
    let tronWeb = useTronWeb();
    const contract = await tronWeb.contract().at(contractAddr);
    try {
        const owner = await contract.ownerOf(tokenId).call();
        return tronWeb.address.fromHex(owner);
    } catch (error) {
        console.log("smartcontract error", error);
        return null
    }
}

export async function getBalanceAddr(address) {
    let tronWeb = useTronWeb();
    const result = await tronWeb.trx.getBalance(address);
    return result;
}

// tokenbound methods

export function isValidAddress(addr) {
    let tronWeb = useTronWeb();
    return tronWeb.isAddress(addr)
}

export function addressToHex(addr) {
    let tronWeb = useTronWeb();
    return tronWeb.address.toHex(addr);
}

export async function getEncodedFunctionData(
    contractAddress,
    func,
    parameters
) {
    let tronWeb = useTronWeb();
    try {
        const {transaction} = await tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            func, 
            {},
            parameters
        );

        const data = transaction.raw_data.contract[0].parameter.value.data

        return `0x${data}`
    } catch (error) {
        console.log(error, {contractAddress, func, parameters})
        return "";
    }
}

export async function tbaGetOwner(tbaAddress) {
    const { id:networkId } = getHostNetwork(window.tronLink.tronWeb.fullNode.host);
    const {
        accountImplementationAbi,
    } = TOKENBOUND[networkId];

    let tronWeb = useTronWeb();
    const contract = await tronWeb.contract(accountImplementationAbi, tbaAddress);
    try {
        const owner = await contract.owner().call();
        return tronWeb.address.fromHex(owner);
    } catch (error) {
        console.log("smartcontract error", error);
        return null
    }
}

export async function tbaGetAddress(tokenContract, tokenId) {
    const { id:networkId, chainId } = getHostNetwork(window.tronLink.tronWeb.fullNode.host);
    const {
        salt,
        registryAbi,
        registryAddress,
        accountImplementationAddress
    } = TOKENBOUND[networkId];

    let tronWeb = useTronWeb();
    const contract = await tronWeb.contract(registryAbi, registryAddress);
    const tid = `${tokenContract}_${tokenId}`;

    try {
        const address = await contract.account(
            accountImplementationAddress,
            salt,
            chainId,
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
    const { id:networkId, chainId } = getHostNetwork(window.tronLink.tronWeb.fullNode.host);
    const {
        salt,
        registryAbi,
        registryAddress,
        accountImplementationAddress
    } = TOKENBOUND[networkId];

    const tweb = window.tronLink.tronWeb;
    const contract = await tweb.contract(registryAbi, registryAddress);

    try {
        const address = await contract.createAccount(
            accountImplementationAddress,
            salt,
            chainId,
            tokenContract,
            tokenId
        )
        .send({
            feeLimit: 1_000_000_000,
        });

        const addressBase58 = tronWeb.address.fromHex(address);
        return addressBase58;
    } catch (error) {
        console.log("smartcontract error", error);
        return null;
    }
}

export async function tbaExecute(to, value, data, tbaAddress) {
    const { id:networkId } = getHostNetwork(window.tronLink.tronWeb.fullNode.host);
    const {
        accountImplementationAbi,
    } = TOKENBOUND[networkId];

    const tweb = window.tronLink.tronWeb;
    const contract = await tweb.contract(accountImplementationAbi, tbaAddress);

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

export async function mintTestNFT(userAddress, index) {
    const { id } = getHostNetwork(window.tronLink.tronWeb.fullNode.host);
    if (id === "mainnet") return;

    let tronWeb = useTronWeb();
    const contractAddr = id === "nile" ? "TNJYzc441rr4u315ABYzNN5MZ8ExjAfqLV" : "TWSvxBxgijiJaKvZh58C4sw3zMeH8qDqUw"
    const contract = await tronWeb.contract().at(contractAddr);
    
    const totalSupply = await contract.totalSupply().call();
    const tokenId = parseInt(totalSupply) + 1 + index;
    const tokenUri = "https://bafybeigwqojrthapgshssffz3iaauj2s3cq4coc4skycphwtimxmrphdje.ipfs.dweb.link"

    try {
        // const newMinter = await contract.addMinter(userAddress).send({ feeLimit: 100_000_000 })
        // console.log(newMinter)

        // const tweb = window.tronLink.tronWeb;
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

// Game Profile NFTs
async function uploadJson(tokenId) {
    const content = getProfileJSON(tokenId);

    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
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

export async function mintProfileNFT(userAddress) {
    const { id } = getHostNetwork(window.tronLink.tronWeb.fullNode.host);
    if (id !== "mainnet") return;

    const contractAddressTKBA = "TJAvdn7NFKFxqsc6M4PZqecypSgxPBvkYy"

    const tweb = window.tronLink.tronWeb;
    const contract = await tweb.contract().at(contractAddressTKBA);
    
    const totalSupply = await contract.totalSupply().call();
    const tokenId = parseInt(totalSupply) + 1;

    const tokenUri = await uploadJson(tokenId)
    if (tokenUri === null) {
        return {
            error: true,
			result: "UPLOAD_ERROR"
        }
    }

    try {
        // let tronWeb = useTronWeb();
        // const newMinter = await tronWeb.contract().at(addressTKBA).addMinter(userAddress).send({ feeLimit: 100_000_000 })
        // console.log(newMinter)

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