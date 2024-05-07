# TOBA - Token Bound Accounts on TRON Network

Our current depployment is working on Nile testnet, check it here [https://tobaontron.xyz](https://tobaontron.xyz)

To test you will need the TronLink extension [https://www.tronlink.org/](https://www.tronlink.org/) and some TRX from this faucet [https://nileex.io/join/getJoinPage](https://nileex.io/join/getJoinPage)


## Inspiration 

The inspiration behind the project to bring a new way to interact with NFTs on
the TRON network was driven by the desire to expand the capabilities of these assets
beyond traditional static collectibles. By introducing token-bound accounts for TRC-721
assets, the project aimed to revolutionize the way users engage with NFTs, allowing for
more dynamic and interactive experiences. The implementation of token-bound accounts not
only enhances the functionality of NFTs but also opens up a myriad of possibilities for
advanced use cases, unlocking a new realm of potential for these digital assets within the
TRON ecosystem.

## What it does?

Following the recommendations of the ERC-6551 standard for the
implementation of Token-Bound Accounts in Ethereum VM-compatible networks, contracts
have been deployed to enable the creation and management of TBAs within the TRON
blockchain, then, a dApp has been developed to facilitate the creation, management and
administration of Token Bound Accounts using a friendly interface where users can interact
directly with the assets within their NFTs, being able to transfer them to different accounts,
either EOAs or TBAs.

Imagine transfer a group of assets just by doing one transaction, well, something like that is
what happens when you send an NFT (who has a TBA) to another wallet, you are
transferring the ownership of the TBA too, and in the practical sense you didn’t had to make
X number of transactions to move all the assets, that’s the power of this implementation.

To demonstrate the practical application of Token Bound Accounts (TBA), we also
developed a captivating mini-game that showcases the unique capabilities of TBAs within
the TRON ecosystem. The mini-game creates the profiles as NFTs that have a TBA and as
the user gains skills (represented as NFTs) they are transferred into it. This makes the
player's profile status completely on-chain and it can be exchanged between different wallets
without losing the progress of the game account.

## Tronscan Contracts

- [Registry](https://nile.tronscan.org/#/contract/TE4xFtwAikSNhVpk7DcDXzooEBhy2eXE3i)
- [Account Implementation](https://nile.tronscan.org/#/contract/TYUBDqFuVxcxEJAYhC7FwwTrtffijWq6vh)
- [NFT Game Profiles](https://nile.tronscan.org/#/contract/TFeL28QUB6e9tF3DzBSZcLcBuPoGW5PHxQ)
- [NFT Game PowerUps](https://nile.tronscan.org/#/contract/TPKriX1NzJhvWkDYbHy1E3zNoyzdhWfJGw)

