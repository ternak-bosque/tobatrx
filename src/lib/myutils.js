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

export const getUITestData = () => {
    return JSON.parse(`{"tokens":[{"address":"TNuoKL1ni8aoshfFL1ASca1Gou9RXwAzfn","name":"BitTorrent","symbol":"BTT","decimals":18,"balance":10000000,"type":"FUNGIBLE_COMMON"}],"nfts":[{"name":"My Animotion Obsession","symbol":"AO2","type":"NON_FUNGIBLE_UNIQUE","address":"TNJYzc441rr4u315ABYzNN5MZ8ExjAfqLV","tokenId":"1","tokenUri":"https://bafybeid7b3d3lolr3or554hcbcciqatrafcvg6o7acpn6jwlnvnx2qmqpq.ipfs.dweb.link/1.json","tba":{"address":"TYh59YSeWVewxXpfsEHyxev6j3jKn3Cv1d","isDeployed":true,"tid":"TNJYzc441rr4u315ABYzNN5MZ8ExjAfqLV_1"},"metadata":{"tokenId":1,"name":"Dudes #1","image":"https://bafybeibiq42sc3yx6jqok6p5cqi46kdwovcycvy4vh6tlruxphsgonnyja.ipfs.dweb.link/1.png","description":"Join our exclusive community of NFT fanatics","attributes":[{"trait_type":"Hair","value":"Bed Head"},{"trait_type":"Face","value":"Rainbow Puke"},{"trait_type":"Body","value":"Navy Sweater"},{"trait_type":"Background","value":"Pink"},{"trait_type":"Traits Count","value":"5"},{"trait_type":"Piercing","value":"None"},{"trait_type":"Head","value":"Med"},{"trait_type":"Rarity Rank","value":38,"display_type":"number"},{"trait_type":"TRON Points","value":9963,"display_type":"number"}]}},{"name":"My Animotion Obsession","symbol":"AO2","type":"NON_FUNGIBLE_UNIQUE","address":"TNJYzc441rr4u315ABYzNN5MZ8ExjAfqLV","tokenId":"2","tokenUri":"https://bafybeid7b3d3lolr3or554hcbcciqatrafcvg6o7acpn6jwlnvnx2qmqpq.ipfs.dweb.link/2.json","tba":{"address":"TSXZuJtWP2VERQxe7VjsnxJYWEF2wULGCn","isDeployed":true,"tid":"TNJYzc441rr4u315ABYzNN5MZ8ExjAfqLV_2"},"metadata":{"tokenId":2,"name":"Dudes #2","image":"https://bafybeibiq42sc3yx6jqok6p5cqi46kdwovcycvy4vh6tlruxphsgonnyja.ipfs.dweb.link/2.png","description":"Join our exclusive community of NFT fanatics","attributes":[{"trait_type":"Face","value":"Whale"},{"trait_type":"Traits Count","value":"3"},{"trait_type":"Body","value":"None"},{"trait_type":"Background","value":"Gradient 3"},{"trait_type":"Hair","value":"None"},{"trait_type":"Piercing","value":"None"},{"trait_type":"Head","value":"Green"},{"trait_type":"Rarity Rank","value":49,"display_type":"number"},{"trait_type":"TRON Points","value":9952,"display_type":"number"}]}},{"name":"My Animotion Obsession","symbol":"AO2","type":"NON_FUNGIBLE_UNIQUE","address":"TNJYzc441rr4u315ABYzNN5MZ8ExjAfqLV","tokenId":"3","tokenUri":"https://bafybeid7b3d3lolr3or554hcbcciqatrafcvg6o7acpn6jwlnvnx2qmqpq.ipfs.dweb.link/3.json","tba":{"address":"TAmYyPxwmumiqJT4w5hpfhXVyWcgZuGUCS","isDeployed":false,"tid":"TNJYzc441rr4u315ABYzNN5MZ8ExjAfqLV_3"},"metadata":{"tokenId":3,"name":"Dudes #3","image":"https://bafybeibiq42sc3yx6jqok6p5cqi46kdwovcycvy4vh6tlruxphsgonnyja.ipfs.dweb.link/3.png","description":"Join our exclusive community of NFT fanatics","attributes":[{"trait_type":"Hair","value":"Holographic Mohawk"},{"trait_type":"Face","value":"Skeleton"},{"trait_type":"Body","value":"Green Hoodie"},{"trait_type":"Background","value":"Gradient 2"},{"trait_type":"Traits Count","value":"5"},{"trait_type":"Piercing","value":"None"},{"trait_type":"Head","value":"Pale"},{"trait_type":"Rarity Rank","value":3503,"display_type":"number"},{"trait_type":"TRON Points","value":6498,"display_type":"number"}]}}]}`)
}