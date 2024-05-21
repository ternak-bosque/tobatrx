import { useEffect, useState } from "react";
import { useApp } from "@/src/context";
import Header from "./header-card";
import AccountAssets from "./account-assets";
import { getUniqueTokenId } from "@/src/lib/myutils";
import { 
    formatAssetDataFromTronscan, 
    getAccountTokensREST,
    getAccountTokens, 
    getNftInfoById, 
    tbaGetAddress 
} from "@/src/service";

const Token = ({ id }) => { 
    const { 
        data: { accountNfts, currentTBA },
        fn: { setCurrentTBA, deployTokenBoundAccount }
    } = useApp();

    const [tokenAddress, tokenId] = id.split("_");

    const [isTokenOwner, setIsTokenOwner] = useState(false);
    const [accountBalance, setAccountBalance] = useState(0);
    const [accountDetail, setAccountDetail] = useState(null);
	const [collectibles, setCollectibles] = useState([]);
	const [assets, setAssets] = useState([]);

    useEffect(() => {
        if (accountNfts !== null) {
            const _accountDetail = accountNfts.find(t => getUniqueTokenId(t) === id)
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
        const _accountTokens = assetsData.filter(t => t.type === "FUNGIBLE_COMMON")
        console.log(assetsData)

        const { accountTokens, accountNfts } = await getAccountTokens(assetsData.map(({address}) => address), tbaAddress);
        setAssets(_accountTokens);
		setCollectibles(accountNfts)
		console.log(_accountTokens, accountNfts)

        const balance = accountAssets.data[0].quantity;
        setAccountBalance(balance)
	}

    if (!accountDetail) {
        return (
            <div className="w-full flex justify-center py-16">
                <div className="loader"></div>
            </div>
        ) 
    }

    return (
        <div className="lg:max-w-3xl mx-auto">
            <div className="p-3 rounded-md w-full">
                <Header 
                    data={accountDetail} 
                    isTokenOwner={isTokenOwner}
                    deployTBA={deployTokenBoundAccount}
                />

                {
                    accountDetail.tba.isDeployed ? (
                        <AccountAssets 
                            tokens={assets} 
                            nfts={collectibles} 
                            balance={accountBalance}
                        />
                    ): (
                        <div className="py-8 text-center text-gray-400 text-xl">
                            No Account Deployed for this Token
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Token