import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

function getRandomNickname() {
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

export const powerUpsTokens = [
    // {
    //     unlock: { prop: "score", goal: 3000 },
    //     image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/lives.png",
    //     title: "Lives +1",
    //     description: "Increase the number of lives to your character",
    //     tile: "tilePowLives1",
    //     type: "lives",
    //     value: 2
    // },
    // {
    //     unlock: { prop: "score", goal: 8000 },
    //     image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/lives.png",
    //     title: "Lives +2",
    //     description: "Increase the number of lives to your character",
    //     tile: "tilePowLives2",
    //     type: "lives",
    //     value: 3
    // },
    {
        unlock: { prop: "distance", goal: 2000 },
        image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/jump.png",
        title: "Jump X3",
        description: "Increase the number of consecutive jumps allowed to your character",
        tile: "tilePowJump1",
        type: "jump",
        value: 3
    },
    {
        unlock: { prop: "distance", goal: 8000 },
        image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/jump.png",
        title: "Jump X4",
        description: "Increase the number of consecutive jumps allowed to your character",
        tile: "tilePowJump2",
        type: "jump",
        value: 4
    },
    {
        unlock: { prop: "distance", goal: 3800 },
        image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/force.png",
        title: "Gravity -1",
        description: "Increase the jump force of your character",
        tile: "tilePowForce1",
        type: "force",
        value: 500
    },
    {
        unlock: { prop: "distance", goal: 10000 },
        image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/force.png",
        title: "Gravity -2",
        description: "Increase the jump force of your character",
        tile: "tilePowForce2",
        type: "force",
        value: 600
    },
    {
        unlock: { prop: "coins", goal: 1500 },
        image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/coins.png",
        title: "Coins +",
        description: "Increase apperance of coins during a run",
        tile: "tilePowCoins1",
        type: "coins",
        value: 30
    },
    {
        unlock: { prop: "coins", goal: 3500 },
        image: "https://bafybeibjcmfe7upvlhkhjhwnefag5iypce7kxmhxvtqz23c2v7xmytxfr4.ipfs.dweb.link/coins.png",
        title: "Coins ++",
        description: "Increase apperance of coins during a run",
        tile: "tilePowCoins2",
        type: "coins",
        value: 35
    },
]

export const getPowerupJSON = (tokenId, data) => {
    console.log(data)
    return {
        "tokenId":tokenId,
        "name":data.title,
        "image":data.image,
        "description":data.description,
        "attributes":[
            {"trait_type":"type","value":data.type},
            {"trait_type":"value","value":data.value,"display_type":"number"}
        ]
    }
}