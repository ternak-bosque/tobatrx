import { cardThemeColors, getUITestData, toFixedIfNecessary } from "@/src/lib/myutils";

const Header = ({ data, isTokenOwner }) => {
    const {
        address,
        name:collectionName,
        symbol,
        tokenId,
        tokenUri,
        metadata:{
            attributes,
            description,
            image: tokenImage,
            name:tokenName
        },
        tba:{isDeployed}
    } = data;

    return (
        <div className={`relative w-full lg:max-w-full lg:flex mb-2 p-4 shadow-md border rounded my-4 border-blue-100 dark:border-slate-900 ${cardThemeColors}`}>
            <div className="flex items-start bg-cover text-center overflow-hidden">
                <img
                    src={tokenImage || fallbackNoImage}
                    alt=""
                    className="h-36 w-auto"
                />
            </div>
            <div className="pl-6 flex flex-col flex-1">
                <div className="mb-2">
                    <span className="inline-block py-1 leading-none text-yellow-600 uppercase tracking-wide text-xs">
                        {symbol}
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
                            <span className="inline-block px-2 py-1 leading-none bg-purple-200 text-purple-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1">
                                Tokenbound
                            </span>
                        ) : null}
                        {!isDeployed && !isTokenOwner ? (
                            <span className="inline-block px-2 py-1 leading-none bg-blue-200 text-blue-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1">
                                No TBA Deployed
                            </span>
                        ) : null}
                    </div>
                    <div className="mt-2">
                        {!isDeployed && isTokenOwner ? (
                            <span className="inline-block px-3 py-2 leading-none bg-blue-200 text-blue-800 rounded-md font-semibold uppercase tracking-wide text-md mr-1">
                                Deploy TBA
                            </span>
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