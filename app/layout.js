import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const metadata = {
    title: "Token Bound Accounts on Tron",
    description: "Boost the User Experience of your NFT projects",
    image: "https://pbs.twimg.com/profile_images/1692258797060796416/_bbMTtuK_400x400.jpg",
    url: `https://toba.vercel.app`,
    sitename: "toba",
};

export default function RootLayout({ children }) {
    return (
        <html suppressHydrationWarning lang="en">
            {/* <link rel="shortcut icon" href="/favico.png" />
          <link rel="icon" href="/favico.png" /> */}
            <meta name="description" content={metadata.description} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={metadata.title} />
            <meta property="og:description" content={metadata.description} />
            <meta property="og:image" content={metadata.image} />
            <meta property="og:url" content={metadata.url} />
            <meta property="og:site_name" content={metadata.sitename} />
            <meta name="twitter:title" content={metadata.title} />
            <meta name="twitter:description" content={metadata.description} />
            <meta name="twitter:image" content={metadata.image} />

            <title>{metadata.title}</title>
            <body className={inter.className}>
                <div>{children}</div>
            </body>
        </html>
    );
}
