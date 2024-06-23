import { parseUnits } from 'viem';
import {
	tbaExecute,
	tbaCreateAccount,
    getEncodedFunctionData,
} from './index';

export async function deployTokenBoundAccount(tokenContract, tokenId) {
    const _continue = confirm(`Do you want to create a Token-Bound Account for this NFT?`);
    if (_continue) {
        const tbaAddress = await tbaCreateAccount(tokenContract, tokenId)
        if (tbaAddress !== null) {
            alert("Account created!")
        }
        else {
            alert("An error occurred!!")
        }
    }
}

export async function sendTokens({
    contractAddress,
    tokenAmount,
    toAddress,
    decimals,
    currentTBA
}){
    // How many tokens?
    let numberOfTokens = parseUnits(tokenAmount, decimals);

    if (contractAddress) {
        let encodedTransferData = await getEncodedFunctionData(
            contractAddress,
            "transfer(address,uint256)",
            [
                {type:'address', value:toAddress},
                {type:'uint256', value:numberOfTokens}
            ]
        )

        //console.log(contractAddress, 0, encodedTransferData, currentTBA)
        const req = await tbaExecute(contractAddress, 0, encodedTransferData, currentTBA)
        console.log(req)
        return req.transactionId
    }
    else {
        //console.log(toAddressHex, numberOfTokens, "0x", currentTBA)
        const req = await tbaExecute(toAddress, numberOfTokens, "0x", currentTBA)
        console.log(req)
        return req.transactionId
    }
}

export async function sendNFT(
    contractAddress,
    toAddress,
    tokenId,
    currentTBA
){ 
    let fromAddress = currentTBA;

    try {			
        let encodedTransferData = await getEncodedFunctionData(
            contractAddress,
            "transferFrom(address,address,uint256)",
            [
                {type:'address', value:fromAddress},
                {type:'address', value:toAddress},
                {type:'uint256', value:tokenId}
            ]
        )

        const req = await tbaExecute(contractAddress, 0, encodedTransferData, currentTBA)
        showTxFeedback(req)
        return req.transactionId
    } catch (e) {
        console.log(e)
        return null;
    }
}