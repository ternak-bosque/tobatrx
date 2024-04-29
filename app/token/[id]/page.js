'use client'

import AppLayout from "@/src/components/common/layout";
import Token from "@/src/components/token";

export default function TokenPage({ params }) {
    const { id } = params;
    return (
        <AppLayout>
            <Token id={id} />
        </AppLayout>
    )
}