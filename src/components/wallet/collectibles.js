import { getUniqueTokenId } from "@/src/lib/myutils";
import { useGetWalletNfts } from "@/src/service/hooks";
import { useEffect } from "react";
import NftCard from "./nft-card";


const Collectibles = ({walletInfo}) => {
    const { data:collectibles, isLoading, isError, refetch } = useGetWalletNfts(walletInfo.address)

    // refetch when tronlink's node or account change
    useEffect(() => {
        if (Boolean(walletInfo.address) && !isLoading) {
            refetch()
        }
    }, [walletInfo.address])

    return (
        <div className="flex flex-wrap -mx-4">
            {
                isLoading && (
                    <div className="w-full flex justify-center py-16">
                        <div className="loader"></div>
                    </div>
                ) 
            }
            {
                collectibles.length === 0 && (
                    <div className="w-full flex flex-col items-center gap-3 justify-center py-16">
                        <span className="text-lg text-gray-400">No NFTs... Mint a Test NFT</span>
                    </div>
                )
            }
            {collectibles.map((data) => (
                <NftCard key={getUniqueTokenId(data)} nft={data} />
            ))}
        </div>
    )
}

export default Collectibles;