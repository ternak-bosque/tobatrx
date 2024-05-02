import { useState } from "react";
import { useApp } from "@/src/context";
import { buttonStyle, getUniqueTokenId, splitHexAddress } from "@/src/lib/myutils";
import { IconExternalLink } from "@tabler/icons-react";
import NftCard from "../common/nft-card";

const Wallet = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const { 
        data: {
            accountInfo,
            accountNfts,
            status
        },
        fn: {
			setWalletDetails
		} 
    } = useApp();

    const handleIsConnecting = () => {
		setIsConnecting(true);
        setWalletDetails();
        setTimeout(() => {
            setIsConnecting(false);
        }, 5000);
    }

    const nfts = accountNfts ? accountNfts : [];
    const address = accountInfo.address? accountInfo.address : "";

    return status !== "connected" ? (
        <div className="text-center flex flex-col items-center justify-center">
            <div className="w-80">
                <button
                    onClick={() => handleIsConnecting()}
                    type="button"
                    className={buttonStyle("purple")}
                >
                    <div className="text-md font-semibold">
                        <span>{isConnecting ? "Connecting Wallet..." : "Connect Wallet"}</span>
                    </div>
                </button>
            </div>

            <div className="flex items-center justify-center my-5">
                <small className="block text-gray-400">
                    {/* Currently on Testnet */}
                </small>
            </div>
        </div>
    ) : (
        <div className="lg:max-w-3xl mx-auto">
            <div className="py-4 rounded-md w-full">
                <div className="flex gap-3">
                    <h2 className="text-2xl font-bold">My NFTs</h2>
                    <span className="px-2 py-2 leading-none bg-purple-300 text-purple-800 rounded-md font-semibold tracking-wide text-sm">
                        <a 
                            href={`https://nile.tronscan.org/#/address/${address}`}
                            className="flex items-center gap-1"
                            target="_blank" 
                        > 
                            {splitHexAddress(address)}
                            <IconExternalLink className="w-4 h-4" />
                        </a>
                    </span>
                </div>
                <div className="flex flex-wrap -mx-4">
                    {nfts.map((data) => (
                        <NftCard key={getUniqueTokenId(data)} nft={data} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wallet;