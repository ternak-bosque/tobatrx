import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@//src/components/ui/dialog";
import { useState, useRef } from "react";
import { IconTransfer } from "@tabler/icons-react";
import { bodyThemeColors, buttonStyle, isNullAddress } from "@/src/lib/myutils";
import { isValidAddress } from "@/src/service";
import { useApp } from "@/src/context";


const getBlockExplorerUrl = (txid) => {
    return `https://nile.tronscan.io/#/transaction/${txid}`;
}

const TokenWithdraw = ({ symbol, address, balance, decimals }) => {
    const {
        fn: { sendTokens }
    } = useApp();

    const [txid, setTxid] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const amountInput = useRef();
    const beneficiaryInput = useRef();

    const handleSubmit = async () => {
        if (isProcessing) return;

        setTxid("");
        const toAddress = beneficiaryInput.current.value;
        const tokenAmount = amountInput.current.value;

        if (!isValidAddress(toAddress)) {
            setErrorMessage("Please set a valid destination address");
            return;
        }

        if (parseFloat(tokenAmount) > balance) {
            setErrorMessage("Insufficient balance");
            return;
        }

        const contractAddress = !isValidAddress(address) ? null : address;
        setIsProcessing(true);
        setErrorMessage("");

        let response = await sendTokens({
            contractAddress,
            tokenAmount,
            toAddress,
            decimals
        });

        setIsProcessing(false);
        if (response !== null) {
            console.log(response);
            setTxid(response);
        } else {
            setErrorMessage("Something went wrong! Try again.");
        }
    };

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
                            SEND TOKENS
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        Current balance: {balance} {symbol}
                    </DialogDescription>
                </DialogHeader>

                {/* <div className="text-center">
                    <input
                        ref={amountInput}
                        type="number"
                        defaultValue={0}
                        className="bg-transparent text-6xl text-center block border-b-2 w-1/2 mx-auto mb-3 focus:outline-none focus:border-yellow-500"
                    />
                    <span className="text-3xl">{symbol}</span>
                </div> */}
                <div className="mt-3">
                    <label className="font-bold text-sm">Amount</label>
                    <div className="flex">
                        <input 
                            ref={amountInput}
                            type="number"
                            defaultValue={0}
                            className="rounded-none rounded-l-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        />
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            {symbol}
                        </span>
                    </div>
                </div>
                
                <div className="w-full relative my-1">
                    <label className="font-bold text-sm">To Address</label>
                    <input
                        ref={beneficiaryInput}
                        type="text"
                        className="block w-full leading-normal h-10 rounded-lg px-3 mt-1 relative border border-gray-300 bg-gray-100"
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

export default TokenWithdraw;