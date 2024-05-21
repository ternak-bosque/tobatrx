import { cardThemeColors, getUITestData, toFixedIfNecessary } from "@/src/lib/myutils";
import { IconCopy, IconExternalLink } from "@tabler/icons-react";

const Header = ({ data, isTokenOwner, deployTBA }) => {
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

    return (
        <div className={`relative w-full lg:max-w-full lg:flex mb-2 p-4 shadow-md border rounded my-4 border-blue-100 dark:border-slate-900 ${cardThemeColors}`}>
            <div className="flex items-start bg-cover text-center overflow-hidden">
                <img
                    src={tokenImage || fallbackImg}
                    alt=""
                    className="h-36 w-auto"
                />
            </div>
            <div className="pl-6 flex flex-col flex-1">
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
                            <span>{collectionName}</span>
                        </a>
                    </div>
                    <div className="flex gap-1 mt-2">
                        {isDeployed ? (
                            <div>
                            <span className="inline-block px-2 py-1 leading-none bg-purple-200 text-purple-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1">
                                Tokenbound
                            </span>
                            <span className="block pl-1 pt-3 leading-none font-semibold tracking-wide text-xs mr-1">
                                <a 
                                    href={`https://nile.tronscan.org/#/address/${tbaAddress}`}
                                    className="flex items-center gap-1"
                                    target="_blank" 
                                > 
                                    {tbaAddress}
                                    <IconCopy className="w-3 h-3" />
                                </a>
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
                                onClick={() => deployTBA(address, tokenId)}
                                className="inline-block px-3 py-2 leading-none bg-blue-200 text-blue-800 rounded-md font-semibold uppercase tracking-wide text-md mr-1"
                            >
                                Deploy TBA
                            </button>
                        ) : null}
                    </div>
                    
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