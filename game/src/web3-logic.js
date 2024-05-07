import StorageKeys from "./consts/StorageKeys";
import {
    delay,
    getGameProfileTokens,
    getProfilePowerUps,
    getValue,
    getWalletDetails,
    initTron,
    mintPowerUp,
    mintProfile,
    storeValue,
    tbaGetAddress,
} from "./service-tron";

// GameStart
export async function initWeb3() {
    let wallet;
    
    try {
        await initTron();
        wallet = await getWalletDetails();
    } catch (error) {
        console.log("no tronlink detected", {error})
        return;
    }

    if (wallet.connected) {
        // check if localStorage has to be cleared
        const lastWalletAddress = getValue(StorageKeys.WalletAddress); // must be a session var
        if (lastWalletAddress !== wallet.details.address) {
            window.localStorage.clear();
        }
        else {
            // data already available and stored
            return;
        }

        // get gameProfile tokens in wallet
        const profiles = await getGameProfileTokens(wallet.details.address);
        storeValue(StorageKeys.WalletAddress, wallet.details.address);
        storeValue(StorageKeys.Profiles, profiles);

        // check for powerUps tokens in profile
        if (profiles.length > 0) {
            let currentTokenId = getValue(StorageKeys.CurrentTokenId);
            let currentProfile =
                currentTokenId === null
                    ? profiles[0]
                    : profiles.find((o) => o.tokenId === currentTokenId);

            if (!currentProfile) return;
            storeValue(StorageKeys.CurrentTokenId, currentTokenId || profiles[0].tokenId);
            storeValue(StorageKeys.CurrentProfile, currentProfile);

            const tba = await tbaGetAddress(
                currentProfile.address,
                currentProfile.tokenId
            );

            if (tba.isDeployed) {
                const powerUps = await getProfilePowerUps(tba.address);
                storeValue(StorageKeys.Powers, powerUps);
                storeValue(StorageKeys.TokenBoundAddress, tba.address);
            } else {
                storeValue(StorageKeys.Powers, null);
                storeValue(StorageKeys.TokenBoundAddress, null);
            }
        }

        console.log("init web3 data");
        return;
    } else {
        window.localStorage.clear();

        if (wallet.details !== null) {
            storeValue(StorageKeys.WalletAddress, "not_connected");
            console.log("no wallet connected, show connect button");
        } else {
            console.log("no extension, do nothing");
        }

        return;
    }
}

// GameConnect
export async function switchProfile(tokenId) {
    const currentId = getValue(StorageKeys.CurrentTokenId)
    if (currentId === tokenId) return;

    const profiles = getValue(StorageKeys.Profiles)
    const selectedProfile = profiles.find(o => o.tokenId === tokenId)

    if (!selectedProfile) return;
    storeValue(StorageKeys.CurrentTokenId, tokenId)
    storeValue(StorageKeys.CurrentProfile, selectedProfile);

    const tba = await tbaGetAddress(selectedProfile.address, tokenId)
    if (tba.isDeployed) {
        const powerUps = await getProfilePowerUps(tba.address);
        storeValue(StorageKeys.Powers, powerUps)
        storeValue(StorageKeys.TokenBoundAddress, tba.address);
    }

    return;
}

// GameConnect, generates a new game profile
export async function generateProfileNFT() {
    const lastWalletAddress = getValue(StorageKeys.WalletAddress);
    const result = await mintProfile(lastWalletAddress);
    if (result.error) return;

    window.localStorage.clear(); // clear the localStorage to get the new wallet state
    await delay(2000)
    await initWeb3() 

    return;
}

export async function generatePowerUps(newTokens) {
    //console.log(newTokens)
    const tbaAddress = getValue(StorageKeys.TokenBoundAddress)
    if (!tbaAddress) return;
    
    const reqMintPowers = newTokens.map((data, i) => mintPowerUp(tbaAddress, data, i))
    const mintResults = await Promise.all(reqMintPowers)
    console.log(mintResults)

    return;
}

export function getUpdatedPowerUpValues() {
    let powerUps = getValue(StorageKeys.Powers);
    let result = {jump: 2, force: 400, coins: 20, lives: 1};
    
    if(powerUps === null)
        return result
    
    powerUps.forEach(o => {
        result[o.metadata.attributes[0].value] =  o.metadata.attributes[1].value
    })

    return result
}