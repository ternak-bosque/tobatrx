import { toFixedIfNecessary } from "@/src/lib/myutils";
import TokenItem from "../common/token-item";
import NftItem from "../common/nft-item";

const AccountAssets = ({ balance = 100000, tokens = [], nfts = [] }) => {
    return (
        <>
            <div className="py-4 rounded-md w-full">
                <h3 className="text-lg font-bold">
                    <span>Assets</span>
                </h3>
                <TokenItem
                    tokenId={0}
                    name={"Tron"}
                    symbol={"TRX"}
                    decimals={6}
                    type={"FUNGIBLE_COMMON"}
                    balance={toFixedIfNecessary(balance, 2)}
                    address={null}
                />
			{
				tokens.map(item => {
					const { address, symbol, type, name, balance, decimals } = item;
					const _balance = toFixedIfNecessary(balance, 2);
					
					return (
						<TokenItem
							key={symbol}
							symbol={symbol}
							balance={_balance}
							decimals={decimals}
							address={address}
							tokenId={0}
							name={name}
							type={type}
						/>
					)
				})
			}
            </div>

            <div className="py-4 rounded-md w-full">
                <h3 className="text-lg font-bold">
                    <span>Collectibles</span>
                </h3>
                <div className="w-full">
                    {nfts.map((data) => (
                        <NftItem key={data.tokenId} nft={data} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default AccountAssets