// ChainId info: https://github.com/tronprotocol/tips/blob/master/tip-474.md

export const NETWORKS = {
    "mainnet": {
        id: "mainnet",
        chainId: 728126428,
        chainIdHex: "0x2b6653dc",
        name: "Mainnet",
        currency: "TRX",
        faucet: "",
        explorer: "https://tronscan.org",
        trongridBaseAPI: "https://api.trongrid.io",
        tronscanBaseAPI: "https://apilist.tronscanapi.com",
    },
    "shasta": {
        id: "shasta",
        chainId: 2494104990,
        chainIdHex: "0x94a9059e",
        name: "Shasta Testnet",
        currency: "TRX",
        faucet: "https://shasta.tronex.io",
        explorer: "https://shasta.tronscan.org",
        trongridBaseAPI: "https://api.shasta.trongrid.io",
        tronscanBaseAPI: "https://shastapi.tronscan.org",
    },
    "nile": {
        id: "nile",
        chainId: 3448148188,
        chainIdHex: "0xcd8690dc",
        name: "Nile Testnet",
        currency: "TRX",
        faucet: "http://nileex.io/join/getJoinPage",
        explorer: "https://nile.tronscan.org",
        trongridBaseAPI: "https://nile.trongrid.io",
        tronscanBaseAPI: "https://nileapi.tronscan.org",
    }
}