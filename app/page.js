import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-between p-24">
            <div className="w-full h-96 flex flex-col items-center">
				<p className="text-5xl font-semibold">Token Bound Accounts on Tron</p>
				<p className="text-xl py-8">Boost the User Experience of your NFT projects</p>

				<Link href={"/"}>
					<div className="box-home w-48 font-semibold border bg-purple-400 text-center rounded-md py-3 px-6">
						<span>My NFTs</span>
					</div>
				</Link>
			</div>
		</main>
    );
}
