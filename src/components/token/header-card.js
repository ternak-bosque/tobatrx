import { cardThemeColors, getUITestData, toFixedIfNecessary } from "@/src/lib/myutils";
import { deployTokenBoundAccount } from "@/src/service/tokenbound";
import { IconCheck, IconCopy, IconExternalLink } from "@tabler/icons-react";
import { useState } from "react";

const Header = ({ data, isTokenOwner }) => {
    const [linkCopied, setLinkCopied] = useState(false);
    let {
        address,
        name:collectionName,
        symbol:collectionSymbol,
        tokenId,
        tokenUri,
        metadata:{
            attributes,
            description,
            image: tokenImage,
            name:tokenName
        },
        tba:{address:tbaAddress, isDeployed}
    } = data;

    let fallbackImg = "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652749173/no-image_qrq0kt.png";

    if (!tokenName) {
        tokenName = `${collectionSymbol} #${tokenId}`
    }

    if (tokenImage) {
        if (tokenImage.startsWith('ipfs')) {
            tokenImage = tokenImage.replace("ipfs://", "https://ipfs.io/ipfs/")
        }
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(tbaAddress);
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 2500);
    }

    return (
        <div className={`relative w-full lg:max-w-full lg:flex lg:gap-3 mb-2 p-4 shadow-md border rounded my-4 border-blue-100 dark:border-slate-900 ${cardThemeColors}`}>
            <div className="flex items-start bg-cover text-center overflow-hidden">
                <img
                    src={tokenImage || fallbackImg}
                    alt=""
                    className="h-36 w-auto"
                />
            </div>
            <div className="flex flex-col flex-1">
                <div className="mb-2">
                    <span className="inline-block py-1 leading-none text-yellow-600 uppercase tracking-wide text-xs">
                        {collectionSymbol}
                    </span>
                    <div className="font-bold text-4xl">
                        {tokenName}
                    </div>
                    {/* <div className="text-gray-400">
                        {description}
                    </div> */}
                    <div className="my-1 text-gray-400">
                        <a href={`https://nile.tronscan.org/#/contract/${address}`} target="_blank">
                            <span>{collectionName} #{tokenId}</span>
                        </a>
                    </div>
                    <div className="flex gap-1 mt-2">
                        {isDeployed ? (
                            <div>
                                <div>
                                    <span className="inline-block px-2 py-1 leading-none bg-purple-200 text-purple-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1">
                                        Tokenbound
                                    </span>
                                    {
                                        isTokenOwner && (
                                            <span className="inline-block px-2 py-1 leading-none bg-blue-200 text-blue-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1">
                                                Owner
                                            </span>
                                        )
                                    }
                                </div>                   
                                <span className="flex items-center gap-1 pl-1 pt-3 leading-none font-semibold tracking-wide text-xs mr-1">
                                    <a 
                                        href={`https://nile.tronscan.org/#/address/${tbaAddress}`}
                                        className="flex items-center gap-1 underline"
                                        target="_blank" 
                                    > 
                                        {tbaAddress}
                                    </a>
                                    <button
                                        type="button"
                                        title="Copy TBA address"
                                        onClick={() => handleCopyToClipboard()}
                                    >
                                        {
                                            linkCopied ? (
                                                <IconCheck className="w-4 h-4" />
                                            ): (
                                                <IconCopy className="w-4 h-4" />
                                            )
                                        }
                                    </button>
                                </span>
                            </div>
                        ) : null}
                        {!isDeployed && !isTokenOwner ? (
                            <span className="inline-block px-2 py-1 leading-none bg-blue-200 text-blue-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1">
                                No TBA Deployed
                            </span>
                        ) : null}
                    </div>
                    <div className="mt-2">
                        {!isDeployed && isTokenOwner ? (
                            <button 
                                type="button"
                                onClick={() => deployTokenBoundAccount(address, tokenId)}
                                className="inline-block px-3 py-2 leading-none bg-blue-200 text-blue-800 rounded-md font-semibold uppercase tracking-wide text-md mr-1"
                            >
                                Deploy TBA
                            </button>
                        ) : null}
                    </div>
                    
                    {/* <div className="mb-1">
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div> */}
                    {/* <div className="mb-1">
                        <span className="inline-block py-1 leading-none text-yellow-600 uppercase tracking-wide text-xs">
                            Attributes
                        </span>
                    </div>
                    <table className="table text-left w-full">
                        <tbody>
                            {attributes.map(
                                (attr, k) => (
                                    <tr key={k}>
                                        <th>
                                            {
                                                attr["trait_type"]
                                            }
                                        </th>
                                        <td className="pl-2">
                                            <input 
                                                readOnly 
                                                type="text" 
                                                className="w-full bg-transparent outline-0"  
                                                value={attr["value"]} 
                                            />
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table> */}
                </div>
            </div>
        </div>
    )
}

export default Header