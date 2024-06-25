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
    tbaGetAddress, 
    getNftOwner
} from "@/src/service";
import { getHostNetwork } from "@/src/service/wallet";

const Token = ({ id }) => { 
    const { 
        data: { walletInfo },
        fn: { setCurrentTBA }
    } = useApp();

    const [tokenAddress, tokenId] = id.split("_");

    const [tokenOwner, setTokenOwner] = useState(false);
    const [accountDetail, setAccountDetail] = useState(null);

    useEffect(() => {
        getExternalNftDetails();
    }, [])

    async function getExternalNftDetails() {
        const _accountDetail = await getNftInfoById(tokenAddress, tokenId);
        const tba = await tbaGetAddress(tokenAddress, tokenId);
        setAccountDetail({..._accountDetail, tba});       
        setCurrentTBA(tba);

        const owner = await getNftOwner(tokenAddress, tokenId);
        setTokenOwner(owner);
    }

    if (!accountDetail) {
        return (
            <div className="w-full flex justify-center py-16">
                <div className="loader"></div>
            </div>
        ) 
    }

    const networkExplorer = walletInfo.network ? "walletInfo.network.explorer" : "";

    return (
        <div className="lg:max-w-3xl mx-auto">
            <div className="p-3 rounded-md w-full">
                <Header 
                    data={accountDetail}
                    networkExplorer={networkExplorer}
                    isTokenOwner={walletInfo.address === tokenOwner}
                />

                {
                    accountDetail.tba.isDeployed ? (
                        <AccountAssets 
                            address={accountDetail.tba.address}
                            isDeployed={accountDetail.tba.isDeployed}
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