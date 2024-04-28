import React, { createContext, useState, useEffect, useContext } from 'react';
import {
	getTronWeb,
	getWalletDetails,
	getAccountTokens,
	tbaGetAddress,
    getAccountCollectiblesREST,
    formatAssetDataFromTronscan,
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

	const data = {
		accountTokens,
		accountInfo,
		accountNfts,
		currentTBA,
		status
	}

	const fn = {
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