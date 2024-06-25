import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

export const fallbackNoImage = "/noimage.svg";
export const cardThemeColors = "bg-white dark:bg-zinc-900";
export const bodyThemeColors =
    "bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-zinc-100";
export const formFieldStyle = 
    "w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline";

export const buttonStyle = (color = "purple") => {
	return `uppercase text-sm font-bold px-3 py-1 rounded-md border border-${color}-700 text-${color}-700 bg-${color}-200 hover:bg-${color}-300`
}

export const sunToTrx = (amount) => {
	return amount/1000000
}

export const trxToSun = (amount) => {
	return amount*1000000
}

export const getUniqueTokenId = (data) => {
    const { address:contractAddress, tokenId } = data
    return `${contractAddress}_${tokenId}`
}

// gets an id string like the ones in Firebase
export const pseudoRandId = () => {
    const CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let autoId = "";

    for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
};

export const isNullAddress = (addr) => {
    return addr === "0x0000000000000000000000000000000000000000";
};

export const splitHexAddress = (addr) => {
    if (!addr) return "0x0";
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4)}`;
};

export const toFixedIfNecessary = (value, dp) => {
    return +parseFloat(value).toFixed(dp);
};

export const divideByDecimals = (num, decimals) => {
    const divider = parseInt(`1${Array(decimals).fill(0).join("")}`);
    return toFixedIfNecessary(num / divider, 8);
};

export const multiplyByDecimals = (num, decimals) => {
    const multiplier = parseInt(`1${Array(decimals).fill(0).join("")}`);
    return toFixedIfNecessary(num * multiplier, 8);
};

export function sleep(ms) {
    return new Promise((val) => setTimeout(val, ms));
}

export const getFromStorage = (key) => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
    }
};

export const setToStorage = (key, value) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
    }
};

export const randRGB = (i = 1) => {
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const r = 92 //randomBetween(0, 255);
    const g = i * 8//randomBetween(0, 255);
    const b = 150 //randomBetween(200, 255);
    return `rgb(${r},${g},${b})`;
}

export const getFallbackImage = (title, i) => {
    const color = randRGB(i);
    return `https://api.nilskoepke.com/profile-image?name=${title.replaceAll(" ", "+")}&backgroundColor=${color}`
}

const getRandomNickname = () => {
    const randomName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        style: 'capital',
        separator: ''
    })

    return randomName;
}

export const getProfileJSON = (tokenId) => {
    const nickname = getRandomNickname();
    return {
        "tokenId":tokenId,
        "name":`Dino #${tokenId}`,
        "image":"https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/dino-nft.jpg",
        "description":"A running dino to play Untittled Adventures",
        "attributes":[
            {"trait_type":"nickname","value":`${nickname}`},
            {"trait_type":"type","value":"profile"},
        ]
    }
}