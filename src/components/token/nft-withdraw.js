import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import { useState, useRef } from "react";
import { IconTransfer } from "@tabler/icons-react";
import { bodyThemeColors, buttonStyle, isNullAddress } from "@/src/lib/myutils";
import { isValidAddress } from "@/src/service";
import { useApp } from "@/src/context";
import { sendNFT } from "@/src/service/tokenbound";

const getBlockExplorerUrl = (txid) => {
    return `https://nile.tronscan.io/#/transaction/${txid}`;
}

const NftWithdraw = ({ nft }) => {
    const {
        data: { currentTBA }
    } = useApp();

    const [txid, setTxid] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const addressInput = useRef();

    const { 
        tokenId, 
        address: contractAddress,
        metadata,
        tokenUri,
        name: collectionName, 
        symbol: collectionSymbol 
    } = nft;

    let { attributes, name:tokenName, image:tokenImg } = metadata

    const handleSubmit = async () => {
        if (isProcessing) return;

        setTxid("");
        const toAddress = addressInput.current.value;

        if (!isValidAddress(toAddress)) {
            setErrorMessage("Please set a valid destination address");
            return;
        }

        setIsProcessing(true);
        setErrorMessage("");

        let response = await sendNFT(
            contractAddress,
            toAddress,
            tokenId,
            currentTBA
        );

        setIsProcessing(false);
        if (response !== null) {
            console.log(response);
            setTxid(response);
        } else {
            setErrorMessage("Something went wrong! Try again.");
        }
    };

    const attributesArray = [];

    return (
        <Dialog>
            <DialogTrigger>
                <div
                    title="Send token"
                    className="flex text-sm p-2 bg-purple-900 text-white rounded-md hover:bg-purple-500 focus:outline-none"
                >
                    <IconTransfer className="w-6 h-6"/>
                </div>
            </DialogTrigger>
            <DialogContent className={`${bodyThemeColors} max-w-lg`}>
                <DialogHeader>
                    <DialogTitle>
                        <span className="text-slate-700 dark:text-slate-100">
                            SEND NFT
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex">
                    <div className="mr-3">
                        <img
                            className="w-36 h-36 rounded-lg mr-5"
                            src={tokenImg}
                            alt={""}
                        />
                    </div>
                    <div className="w-2/3 sm:w-4/5">
                        <div className="mb-2">
                            <span className="text-purple-700">{"Token Symbol:"}</span>{" "}
                            <span>{collectionSymbol}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-purple-700">{"Token Name:"}</span>{" "}
                            <span>{tokenName}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-purple-700">{"Token ID:"}</span>{" "}
                            <span>
                                {parseInt(tokenId)}
                            </span>
                        </div>
                        {/*attributesArray.length === 0 ? null : (
                            <>
                                <div>Attributes</div>
                                <code>
                                    <pre className="codeblock py-2">
                                        {attributesArray.map((attr) => (
                                            <div key={attr.trait_type}>
                                                {" "}
                                                {attr.trait_type}: {attr.value}{" "}
                                            </div>
                                        ))}
                                    </pre>
                                </code>
                            </>
                        )*/}
                    </div>
                </div>
                <div className="w-full relative my-2">
                    <label className="text-sm">To Address</label>
                    <input
                        ref={addressInput}
                        type="text"
                        className="block w-full border-gray-300 leading-normal h-10 rounded-lg px-3 mt-1 relative border bg-gray-100"
                    />
                    {errorMessage && (
                        <small className="block text-red-400 mt-2">
                            {errorMessage}
                        </small>
                    )}
                </div>
                {txid !== "" && (
                    <div className="text-center">
                        <a
                            className="block text-sm"
                            href={`${getBlockExplorerUrl(txid)}`}
                            target="_blank"
                        >
                            Transaction ongoing.{" "}
                            <span className="text-red-400 underline">
                                Check details
                            </span>
                        </a>
                    </div>
                )}
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        className={isProcessing ? buttonStyle("gray") : buttonStyle()}
                        onClick={() => handleSubmit()}
                    >
                        <span className="block text-md">
                            {isProcessing ? "Processing..." : "Send"}
                        </span>
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default NftWithdraw;