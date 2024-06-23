import { useEffect, useState } from "react";
import { useApp } from "@/src/context";
import { buttonStyle } from "@/src/lib/myutils";
import { mintTestNFT } from "@/src/service";
import Collectibles from "./collectibles";

const Wallet = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const { 
        data: {
            walletInfo,
            status
        },
        fn: {
			setAccountData
		} 
    } = useApp();

    const handleIsConnecting = () => {
		console.log("hi!")
    }

    const doMint = async () => {
        const reqMint = [0,0,0].map((v, i) => mintTestNFT(walletInfo.address, i))
        const mintResults = await Promise.all(reqMint)
        console.log(mintResults);
        alert("NFTs Minted")
    }

    return status !== "connected" ? (
        <div className="text-center flex flex-col items-center justify-center">
            <div className="w-100">
                <div className="w-full flex justify-center py-16">
                    <div className="text-xl text-gray-400">Please connect your wallet to manage your collectibles</div>
                </div>
            </div>
        </div>
    ) : (
        <div className="lg:max-w-3xl mx-auto">
            <div className="py-4 rounded-md w-full">
                <div className="flex gap-3">
                    <h2 className="text-2xl font-bold">Your Collectibles</h2>
                </div>
                <div className="w-full flex justify-end">
                    {/* <button
                        className={buttonStyle("blue")}
                        onClick={() => doMint()}
                    >
                        Mint Test NFT
                    </button> */}
                </div>
                {
                    walletInfo.address && (
                        <Collectibles walletInfo={walletInfo} />
                    )
                }
            </div>
        </div>
    );
};

export default Wallet;