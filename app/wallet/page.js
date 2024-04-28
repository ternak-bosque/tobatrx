'use client'

import Wallet from "@/src/components/wallet";
import AppLayout from "@/src/components/common/layout";

export default function WalletPage({ params }) {
    const { address } = params;
    return (
        <AppLayout>
            <Wallet />
        </AppLayout>
    )
}