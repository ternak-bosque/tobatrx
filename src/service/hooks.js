import { useQuery } from 'react-query';
import {
    tbaGetAddress,
	getAccountTokens,
    getAccountTokensREST,
	formatAssetDataFromTronscan,
    getAccountCollectiblesREST,
} from './index';


export function useGetWalletNfts(address) {
    let key = "wallet-nfts";
    let { data, isLoading, isError, refetch } = useQuery(
        [key], 
        () => getWalletNfts(address), 
        { enabled: Boolean(address) }
    )
    let mydata = typeof data !== "undefined" ? data : [];

    return {
        data: mydata,
        isError,
        isLoading,
        refetch
    }
}

export function useGetTbaAssets(address) {
    const key = "tba-assets";
    let { data, isLoading, isError, isFetching } = useQuery([key], () => getTbaAssets(address), { enabled: Boolean(address) });
    let mydata = typeof data !== "undefined" ? data : [];

    return {
        data: mydata,
        isError,
        isLoading,
        isFetching
    }
}

async function getWalletNfts(walletAddress) {
    const accountAssets = await getAccountCollectiblesREST(walletAddress);
    const assetsData = accountAssets.data.map(o => formatAssetDataFromTronscan(o))
    const { accountNfts } = await getAccountTokens(assetsData, walletAddress);

    const reqTbaInfo = accountNfts.map(t => tbaGetAddress(t.address, t.tokenId));
    const tbaInfo = await Promise.all(reqTbaInfo);
    console.log(tbaInfo)

    const _accountNfts = tbaInfo.map(tba => {
        const data = accountNfts.find(t => tba.tid === `${t.address}_${t.tokenId}`);
        return { ...data, tba }
    });

    return _accountNfts
}

async function getTbaAssets(tbaAddress) {
    const accountAssets = await getAccountTokensREST(tbaAddress);
    const assetsData = accountAssets.data.map(o => formatAssetDataFromTronscan(o)).filter(t => t.address !== "_")

    const { accountNfts, accountTokens } = await getAccountTokens(assetsData, tbaAddress);
    const balance = accountAssets.data[0].quantity;

    return {
        balance,
        assets: accountTokens,
        collectibles: accountNfts
    }
}