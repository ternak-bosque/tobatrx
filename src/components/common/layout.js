import Link from "next/link";
import ConnectButton from "./connect-button";

const Navigation = () => {
    return (
        <header className="z-10 fixed top-0 left-0 w-full py-3 text-slate-100 bg-purple-900 dark:bg-slate-900">
            <div className="flex justify-between items-center max-w-5xl w-full mx-auto px-3">
                <Link href="/">
                    <div className="w-full flex justify-center items-center gap-2">
                        <img src="/favico.png" alt="logo" className="w-8 h-8 rounded-md" />
                        <span className="font-mono text-xl font-bold">
                            Tokenbound Accounts
                        </span>
                    </div>
                </Link>
                <ConnectButton />
            </div>
        </header>
    );
};

const AppLayout = ({ children }) => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between px-3 lg:px-24 py-8">
            <div className="z-10 max-w-5xl w-full text-sm pt-10">
                <Navigation />
                {children}
            </div>
        </main>
    )
}

export default AppLayout