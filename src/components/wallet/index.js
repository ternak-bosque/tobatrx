import { useEffect, useState } from "react";
import { useApp } from "@/src/context";
import { buttonStyle } from "@/src/lib/myutils";
import { mintProfileNFT, mintTestNFT } from "@/src/service";
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
        if (walletInfo.network.id !== "mainnet") {
            const reqMint = [0,0].map((v, i) => mintTestNFT(walletInfo.address, i))
            const mintResults = await Promise.all(reqMint)
            console.log(mintResults);
        }
        else {
            const res = await mintProfileNFT(walletInfo.address)
            console.log(res)
        }
         
        alert("NFT Minted")
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
                <div className="flex justify-between items-center gap-3">
                    <h2 className="text-2xl font-bold">Your Collectibles</h2>
                    <div className="">
                        {walletInfo.network.id === "mainnet" && (
                            <button
                                className={buttonStyle("blue")}
                                onClick={() => doMint()}
                            >
                                Mint Game Profile NFT
                            </button>
                        )}
                    </div>
                </div>
                {
                    walletInfo.address && (
                        <Collectibles 
                            walletInfo={walletInfo}
                            doMint={doMint}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default Wallet;