import { NETWORKS } from "../constants/networks";

export function getTronWeb() {
    // Obtain the tronweb object injected by tronLink
    var obj = setInterval(async () => {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
            clearInterval(obj);
            console.log("tronWeb successfully detected!");
        }
    }, 100);
}

export const getBalance = async () => {
    //if wallet installed and logged , getting TRX token balance
    if (window.tronLink.tronWeb && window.tronLink.tronWeb.ready) {
        let walletBalances = await window.tronLink.tronWeb.trx.getAccount(
            window.tronLink.tronWeb.defaultAddress.base58
        );
        return walletBalances;
    } else {
        return 0;
    }
};

export const getHostNetwork = (host) => {
    // if (host.indexOf('nile') !== -1) 
    //     return { id:"nile", chainIdHex:"0xcd8690dc" };
    // else if (host.indexOf('shasta') !== -1)
    //     return { id:"shasta", chainIdHex:"0x94a9059e" };
    // else
    //     return { id:"mainnet", chainIdHex:"0x2b6653dc" };

    if (host.indexOf('nile') !== -1) 
        return NETWORKS["nile"];
    else if (host.indexOf('shasta') !== -1)
        return NETWORKS["shasta"];
    else
        return NETWORKS["mainnet"];
}

export const getWalletDetails = async () => {
    if (window.tronLink.tronWeb) {
        //checking if wallet injected
        if (window.tronLink.tronWeb.ready) {
            let tempBalance = await getBalance();
            let tempFrozenBalance = 0;

            if (!tempBalance.balance) {
                tempBalance.balance = 0;
            }

            //checking if any frozen balance exists
            // if (
            //     !tempBalance.frozen &&
            //     !tempBalance.account_resource.frozen_balance_for_energy
            // ) {
            //     tempFrozenBalance = 0;
            // } else {
            //     if (
            //         tempBalance.frozen &&
            //         tempBalance.account_resource.frozen_balance_for_energy
            //     ) {
            //         tempFrozenBalance =
            //             tempBalance.frozen[0].frozen_balance +
            //             tempBalance.account_resource.frozen_balance_for_energy
            //                 .frozen_balance;
            //     }
            //     if (
            //         tempBalance.frozen &&
            //         !tempBalance.account_resource.frozen_balance_for_energy
            //     ) {
            //         tempFrozenBalance = tempBalance.frozen[0].frozen_balance;
            //     }
            //     if (
            //         !tempBalance.frozen &&
            //         tempBalance.account_resource.frozen_balance_for_energy
            //     ) {
            //         tempFrozenBalance =
            //             tempBalance.account_resource.frozen_balance_for_energy
            //                 .frozen_balance;
            //     }
            // }

            //we have wallet and we are logged in
            const details = {
                name: window.tronLink.tronWeb.defaultAddress.name,
                address: window.tronLink.tronWeb.defaultAddress.base58,
                balance: tempBalance.balance / 1000000,
                frozenBalance: tempFrozenBalance / 1000000,
                network: getHostNetwork(window.tronLink.tronWeb.fullNode.host),
                link: "true",
            };
            return {
                connected: true,
                details,
            };
        } else {
            //we have wallet but not logged in
            const details = {
                name: "none",
                address: "none",
                balance: 0,
                frozenBalance: 0,
                network: "none",
                link: "false",
            };
            return {
                connected: false,
                details,
            };
        }
    } else {
        //wallet is not detected at all
        return {
            connected: false,
            details: null,
        };
    }
};

export const getWalletEvent = (e) => {
    if (e.data.message && e.data.message.action == "tabReply") {
        console.log("tabReply event", e.data.message)
        if (!e.data.message.data.data.node) 
            return {};
        if (e.data.message.data.data.node.chain == '_'){
            console.log("tronLink currently selects the main chain")
        }else{
            console.log("tronLink currently selects the side chain")
        }

        return { action: "tabReply", data: e.data.message.data }
    }

    if (e.data.message && e.data.message.action == "setAccount") {
        console.log("setAccount event", e.data.message)
        console.log("current address:", e.data.message.data.address)

        return { action: "setAccount", data: e.data.message.data }
    }

    if (e.data.message && e.data.message.action == "setNode") {
        console.log("setNode event", e.data.message)

        let action = "setNode"
        if (e.data.message.data.node.chain == '_'){
            console.log("tronLink currently selects the main chain")
        }else{
            console.log("tronLink currently selects the side chain")
        }
      
        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support 
        if (e.data.message && e.data.message.action == "connect") {
            console.log("connect event", e.data.message.isTronLink)
            action = "connect"
        }
        
        // Tronlink chrome v3.22.1 & Tronlink APP v4.3.4 started to support 
        if (e.data.message && e.data.message.action == "disconnect") {
            console.log("disconnect event", e.data.message.isTronLink)
            action = "disconnect"
        }
        
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support 
        if (e.data.message && e.data.message.action == "accountsChanged") {
            console.log("accountsChanged event", e.data.message)
            console.log("current address:", e.data.message.data.address)
            action = "accountsChanged"
        }
        
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support  
        if (e.data.message && e.data.message.action == "connectWeb") {
            console.log("connectWeb event", e.data.message)
            console.log("current address:", e.data.message.data.address)
            action = "connect"
        }
        
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support   
        if (e.data.message && e.data.message.action == "accountsChanged") {
            console.log("accountsChanged event", e.data.message)
            action = "accountsChanged"
        }
        
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support      
        if (e.data.message && e.data.message.action == "acceptWeb") {
            console.log("acceptWeb event", e.data.message)
        }
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support      
        if (e.data.message && e.data.message.action == "disconnectWeb") {
            console.log("disconnectWeb event", e.data.message)
            action = "disconnect"
        }
        
        // Tronlink chrome v3.22.0 & Tronlink APP v4.3.4 started to support     
        if (e.data.message && e.data.message.action == "rejectWeb") {
            console.log("rejectWeb event", e.data.message)
            action = "reject"
        }

        return { action, data: e.data.message.data }
    }
}
