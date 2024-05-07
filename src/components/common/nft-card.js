import Link from "next/link";
import { IconHexagonLetterB, IconLink } from "@tabler/icons-react";
import { cardThemeColors, getUniqueTokenId } from "@/src/lib/myutils";

const withTokenBoundAccount = () => {
    return true
}

const NftCard = ({ nft }) => { 
    const { 
        tokenId, 
        address,
        metadata, 
        tokenUri,
        name:collectionName, 
        symbol:collectionSymbol 
    } = nft;

    let linkTo = `/token/${getUniqueTokenId(nft)}`;
    let fallbackImg = "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652749173/no-image_qrq0kt.png";
    let { name:tokenName, image:tokenImg } = metadata
    let { address:tbaAddress, isDeployed } = nft.tba

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <Link href={linkTo}>
                <div className={`${cardThemeColors} block shadow-md hover:shadow-xl rounded-lg overflow-hidden relative`}>
                    <div className="h-4 w-full">&nbsp;</div>
                    <div className="relative pb-48 overflow-hidden">
                        <img
                            className="absolute inset-0 h-full w-full object-contain"
                            src={tokenImg}
                            alt=""
                            onError={(e) => {
                                e.target.src = fallbackImg;
                            }}
                        />
                    </div>
                    <div className="p-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center my-1 font-bold">
                                <span>{tokenName}</span>&nbsp;
                            </h2>
                        </div>
                        <span className="block py-1 leading-none text-gray-400 uppercase tracking-wide text-xs">
                            {collectionName}
                        </span>
                        {isDeployed ? (
                            <span className="inline-block absolute top-5 right-6 px-1 py-1 leading-none bg-purple-200 text-purple-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                                <IconLink strokeWidth={2}/>
                            </span>
                        ) : null}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default NftCard