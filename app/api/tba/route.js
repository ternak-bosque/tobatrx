import { NextResponse } from "next/server";
import TronWeb from "tronweb";

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    privateKey: process.env.TRON_NFT_OPERATOR_PK
});

async function tbaGetAddress(tokenContract, tokenId) {
    const MAINNET_ID = 3448148188;
    const SALT = "0x1000000000000000000000000000000000000000000000000000000000000000";
    const REGISTRY_CONTRACT_ADDRESS = "TE4xFtwAikSNhVpk7DcDXzooEBhy2eXE3i";
    const IMPLEMENTATION_CONTRACT_ADDRESS = "TYUBDqFuVxcxEJAYhC7FwwTrtffijWq6vh";

    const contract = await tronWeb.contract().at(REGISTRY_CONTRACT_ADDRESS);

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
            error: false
        };
    } catch (error) {
        console.log("smartcontract error", error);
        return {
            account: null,
            isDeployed: false,
            error: true
        };
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const contract = searchParams.get("c");
    const tokenId = searchParams.get("id");

    const result = await tbaGetAddress(contract, tokenId);

    return NextResponse.json(result, {
        status: 200,
    });
}
