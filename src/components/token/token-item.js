import { IconTransfer } from "@tabler/icons-react";
import TokenWithdraw from "../token/token-withdraw";

const TokenItem = ({ symbol, balance, tokenId, type, name, address, decimals }) => {
    if (type === 'NON_FUNGIBLE_UNIQUE')
        return <div></div>;
        
    return (
        <div className="flex items-center justify-between mt-3 bg-gray-100 border rounded-md px-3 py-3">
            <div className="py-2">
                <span className="font-bold">{symbol}</span>
                <small className="block text-sm text-gray-400">{name}</small>
            </div>
            <div className="flex">
                <div className="text-right grow leading-5 p-2 pr-5">
                    <span className="text-base tracking-tight">
                        {balance}
                    </span>
                </div>
                <TokenWithdraw 
                    symbol={symbol}
                    address={address}
                    decimals={decimals}
                    balance={balance}
                />
            </div>
        </div>
    );
};

export default TokenItem;