import { IconTransfer } from "@tabler/icons-react";
import NftWithdraw from "../token/nft-withdraw";

const NftItem = ({ nft }) => {
    // let title = `${symbol} #${parseInt(tokenId)}`;

    const { 
        tokenId, 
        address,
        metadata, 
        tokenUri,
        name:collectionName, 
        symbol:collectionSymbol 
    } = nft;

    let fallbackImg = "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652749173/no-image_qrq0kt.png";
    let { name:tokenName, image:tokenImg } = metadata

    return (
        <div className="flex justify-between items-center mt-3 bg-gray-100 border rounded-md px-3 py-2">
            <div className="flex gap-2">
                <div>
                    <img className="w-12 h-12 rounded-sm" src={tokenImg} alt={tokenName} />
                </div>
                <div className="grow leading-5 p-1">

                        <h5 className="text-md font-bold tracking-tight">
                            {tokenName}
                        </h5>
                        <small className="text-sm text-gray-400">{collectionName}</small>

                </div>
            </div>
            <div className="p-2 pr-0">
                <NftWithdraw nft={nft} />
            </div>
        </div>
    )
}

export default NftItem