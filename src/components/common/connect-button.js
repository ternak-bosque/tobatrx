'use client'

import { useApp } from "@/src/context";
import { buttonStyle, splitHexAddress } from "@/src/lib/myutils";
import { useEventListener } from "@/src/lib/use-event-listener";
import { getWalletEvent } from "@/src/service/wallet";

const WalletEvents = ({ setWalletDetails }) => {
    useEventListener("message", handleWalletEvent, window);

    async function handleWalletEvent(e) {
		const evt = getWalletEvent(e);
		if (!evt || !evt.action) return;

		// when change account
		if (evt.action === "setAccount") {
            setWalletDetails()
		}

		// when change network
		if (evt.action === "accountsChanged" || evt.action === "setNode") {
			setWalletDetails()
		}
	}

    return <span></span>
}

const ConnectButton = () => {
    const { 
        data: {
            walletInfo,
            status
        },
        fn: {
            setWalletDetails,
			setAccountData
		} 
    } = useApp();

    const handleIsConnecting = () => {
        setWalletDetails()
    }

    return status !== "connected" ? (
        <button
            onClick={() => handleIsConnecting()}
            type="button"
            className={buttonStyle("purple")}
        >
            <div className="text-md font-semibold">
                <span>{"Connect Wallet"}</span>
            </div>
        </button>
    ):(
        <div>
            <WalletEvents setWalletDetails={setWalletDetails} />
            <span className="px-2 py-2 leading-none bg-gray-900 capitalize text-gray-100 rounded-md rounded-r-none font-semibold tracking-wide text-sm">
                {walletInfo.network.name}
            </span>
            
            <span className="px-2 py-2 leading-none bg-purple-300 text-purple-800 rounded-md rounded-l-none font-semibold tracking-wide text-sm"> 
                <a 
                    href={`${walletInfo.network.explorer}/#/address/${walletInfo.address}`}
                    target="_blank" 
                > 
                    {splitHexAddress(walletInfo.address)}
                </a>
            </span>
        </div>
    )
}

export default ConnectButton;