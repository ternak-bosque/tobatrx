import { toFixedIfNecessary } from "@/src/lib/myutils";
import TokenItem from "./token-item";
import NftItem from "./nft-item";
import { useGetTbaAssets } from "@/src/service/hooks";

const AccountAssets = ({ address, isDepoyed }) => {
    const { data, isLoading, isError, isFetching } = useGetTbaAssets(address, isDepoyed);
    const { 
        balance = 0, 
        assets = [], 
        collectibles = [] 
    } = data;

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
				!isFetching && assets.map(item => {
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
                    {
                        isFetching && (
                            <div className="w-full flex justify-center py-8">
                                <div className="text-lg text-gray-400">Loading Assets...</div>
                            </div>
                        ) 
                    }
                    {
                        collectibles.length === 0 && (
                            <div className="w-full flex justify-center py-8">
                                <div className="text-lg text-gray-400">No collectibles found</div>
                            </div>
                        ) 
                    }
                    {!isFetching && collectibles.map((data) => (
                        <NftItem key={data.tokenId} nft={data} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default AccountAssets