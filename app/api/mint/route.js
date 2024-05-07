import { NextResponse } from "next/server";
import TronWeb from "tronweb";
//const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    privateKey: process.env.TRON_NFT_OPERATOR_PK
});

async function mintToken({toAddress, tokenId, tokenUri, contractAddress}) {
    const contract = await tronWeb.contract().at(contractAddress);
    
    // const totalSupply = await contract.totalSupply().call();
    // const tokenId = totalSupply + 1;

    try {
        const result = await contract
            .mintWithTokenURI(toAddress, tokenId, tokenUri)
            .send({
                feeLimit: 100_000_000
            });
        return {
            error: false,
            result: "SUCCESS",
            txid: result
        }
    } catch (error) {
        console.log(error)
        return {
            error: true,
			result: "MINTING_ERROR"
        }
    }
}

export async function POST(req) {
    const data = await req.json();
    const result = await mintToken(data)
    return NextResponse.json(result)
}