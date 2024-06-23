import React, { createContext, useState, useEffect, useContext } from 'react';
import { parseUnits } from "viem";
import {
	getTronWeb,
	getWalletEvent,
	getWalletDetails,
} from './service/wallet';
import {
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
	const [walletInfo, setWalletInfo] = useState({});
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
				console.log("Wallet connected", walletDetails);
				setStatus('connected');
				//walletDetails.details.address = "TWzsVxiFPAr86tufyS2x3Bnrn2JfdZzMLe"
				//setAccountData(walletDetails.details);
				setWalletInfo(walletDetails.details);
				clearInterval(interval);
			}        
        }, 2000);
	}

	async function setAccountData() {
		if(!walletInfo.address) return;

        const accountAssets = await getAccountCollectiblesREST(walletInfo.address);
        const assetsData = accountAssets.data.map(o => formatAssetDataFromTronscan(o))
        const { accountNfts } = await getAccountTokens(assetsData.map(({address}) => address), walletInfo.address);

		const reqTbaInfo = accountNfts.map(t => tbaGetAddress(t.address, t.tokenId));
		const tbaInfo = await Promise.all(reqTbaInfo);

		const _accountNfts = tbaInfo.map(tba => {
			const data = accountNfts.find(t => tba.tid === `${t.address}_${t.tokenId}`);
			return { ...data, tba }
		});

		// const _accountNfts = accountNfts.map(el => {
		// 	return {...el, tba:{address:"", isDeployed:false}}
		// })
		
		setAccountNfts(_accountNfts)
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
		walletInfo,
		accountNfts,
		currentTBA,
		status
	}

	const fn = {
		setAccountData,
		setWalletDetails,
		setCurrentTBA,
	}

	return (
		<DataContext.Provider value={{ data, fn }}>
			{props.children}
		</DataContext.Provider>
	);
}

export default AppProvider;