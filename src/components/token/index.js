import { useEffect, useState } from "react";
import { formatAssetDataFromTronscan, getAccountTokens, getAccountTokensREST, getNftInfoById, tbaGetAddress } from "@/src/service";
import { useApp } from "@/src/context";
import Header from "./header-card";
import AccountAssets from "./account-assets";


const Token = ({ id }) => { 
    const { 
        data: { accountNfts, currentTBA },
        fn: { setCurrentTBA }
    } = useApp();

    const [tokenAddress, tokenId] = id.split("_");

    const [isTokenOwner, setIsTokenOwner] = useState(false);
    const [accountBalance, setAccountBalance] = useState(0);
    const [accountDetail, setAccountDetail] = useState(null);
	const [collectibles, setCollectibles] = useState([]);
	const [assets, setAssets] = useState([]);

    // useEffect(() => {
    //     if (tokenAddress !== null)
    //         setAccountData()
    // }, [tokenAddress])

    useEffect(() => {
        if (accountNfts !== null) {
            const _accountDetail = accountNfts.find(t => t.tokenId === tokenId)
            if (_accountDetail) {
                setAccountDetail(_accountDetail)
                setCurrentTBA(_accountDetail.tba.address)
                setIsTokenOwner(true)
            
                if (_accountDetail.tba.isDeployed) {
                    setAccountData(_accountDetail.tba.address);
                }
            }
            else {
                getExternalNftDetails();
            }          
        }        
    }, [accountNfts])

    async function getExternalNftDetails() {
        const _accountDetail = await getNftInfoById(tokenAddress, tokenId);
        const tba = await tbaGetAddress(tokenAddress, tokenId);
        setAccountDetail({..._accountDetail, tba});       
        setCurrentTBA(tba);

        if (tba.isDeployed) {
            setAccountData(tba.address);
        }
    }

    async function setAccountData(tbaAddress) {
        const accountAssets = await getAccountTokensREST(tbaAddress);
        const assetsData = accountAssets.data.map(o => formatAssetDataFromTronscan(o)).filter(t => t.address !== "_")
        //const tokensGrouped = Object.groupBy(assetsData, ({type}) => type)
        console.log(assetsData)

        const { accountTokens, accountNfts } = await getAccountTokens(assetsData.map(({address}) => address), tbaAddress);
        setAssets(accountTokens);
		setCollectibles(accountNfts)
		console.log(accountTokens, accountNfts)

        const balance = accountAssets.data[0].quantity;
        setAccountBalance(balance)
	}

    if (!accountDetail) {
        return <div></div>
    }

    return (
        <div className="lg:max-w-3xl mx-auto">
            <div className="p-3 rounded-md w-full">
                <Header 
                    data={accountDetail} 
                    isTokenOwner={isTokenOwner}
                />

                <AccountAssets 
                    tokens={assets} 
                    nfts={collectibles} 
                    balance={accountBalance}
                />
            </div>
        </div>
    )
}

export default Token