import React, { createContext, useState, useEffect, useContext } from 'react';
import { parseUnits } from "viem";
import {
	getTronWeb,
	getWalletDetails,
	getAccountTokens,
    getAccountInfo,
	tbaGetAddress,
	tbaExecute,
	addressToHex,
	getEncodedFunctionData,
    getAccountCollectiblesREST,
    formatAssetDataFromTronscan,
	tbaCreateAccount,
} from './service';


const DataContext = createContext();
export const useApp = () => useContext(DataContext);

const AppProvider = (props) => {
	const [accountInfo, setAccountInfo] = useState({});
	const [accountNfts, setAccountNfts] = useState(null);
	const [accountTokens, setAccountTokens] = useState(null);
	const [currentTBA, setCurrentTBA] = useState({});
	const [status, setStatus] = useState('');

	useEffect(() => {
		console.log("Tron context");
		setTimeout(() => {
            initTron();
        }, 500);	
	}, [])

	async function initTron() {
        const res = await window.tronLink.request({
            method: "tron_requestAccounts",
        });
        getTronWeb();
        setWalletDetails();
    }

	async function setWalletDetails() {
		const interval = setInterval(async () => {
            const walletDetails = await getWalletDetails();
            //wallet checking interval 2sec
            if (walletDetails.connected) {
				console.log("Wallet connected");
				setStatus('connected');
				//walletDetails.details.address = "TWzsVxiFPAr86tufyS2x3Bnrn2JfdZzMLe"
				setAccountData(walletDetails.details);
				clearInterval(interval);
			}        
        }, 2000);
	}

	async function setAccountData(walletDetails) {
		setAccountInfo(walletDetails);

        const accountAssets = await getAccountCollectiblesREST(walletDetails.address);
        const assetsData = accountAssets.data.map(o => formatAssetDataFromTronscan(o))
        const { accountNfts } = await getAccountTokens(assetsData.map(({address}) => address), walletDetails.address);

		const reqTbaInfo = accountNfts.map(t => tbaGetAddress(t.address, t.tokenId));
		const tbaInfo = await Promise.all(reqTbaInfo);

		const _accountNfts = tbaInfo.map(tba => {
			const data = accountNfts.find(t => tba.tid === `${t.address}_${t.tokenId}`);
			return { ...data, tba }
		});

		setAccountNfts(_accountNfts)
	}

	async function deployTokenBoundAccount(tokenContract, tokenId) {
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

	async function sendTokens({
		contractAddress,
		tokenAmount,
		toAddress,
		decimals
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
			showTxFeedback(req)
			return req.transactionId
		}
		else {
			//console.log(toAddressHex, numberOfTokens, "0x", currentTBA)
			const req = await tbaExecute(toAddress, numberOfTokens, "0x", currentTBA)
			showTxFeedback(req)
			return req.transactionId
		}
    }

    async function sendNFT(
        contractAddress,
        toAddress,
        tokenId
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

	function showTxFeedback(req) {
		// setTimeout(async () => {
		// 	if (req.transactionId) {
		// 		const txinfo = await window.tronWeb.trx.getTransactionInfo(req.transactionId);
		// 		console.log(txinfo)
		// 		const result = txinfo.receipt.result
		// 		console.log(`The transaction ${txinfo.id} was ${result}`)
		// 	}	
		// }, 5000);
	}

	const data = {
		accountTokens,
		accountInfo,
		accountNfts,
		currentTBA,
		status
	}

	const fn = {
		deployTokenBoundAccount,
		setWalletDetails,
		setCurrentTBA,
		sendTokens,
		sendNFT
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default AppProvider;