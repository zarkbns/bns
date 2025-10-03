# BNS — Based Name Service

**BNS** is a universal, omni-chain naming service that allows you to register a single name (e.g. `yourname.bns`) and link it to wallet addresses across any blockchain: Ethereum, Solana, Bitcoin, and more.

## Vision

Manage all your blockchain identities with one name. No more juggling multiple ENS/SNS records. With BNS, you register once, link your wallets, and use your `.bns` tag everywhere.

## Features

- **NFT Ownership:** Each name is an ERC-721 NFT — own, transfer, and sell your names.
- **Multi-Chain:** Link addresses from any blockchain.
- **Edit Lock:** Once linked, addresses can’t be updated until 30 days have passed, ensuring security.
- **Dapp Ready:** Built for integration with the Base ecosystem.

## Contract Structure

See [`contracts/BNS.sol`](contracts/BNS.sol) for the Solidity smart contract.

## Usage (Solidity)

- `register(name, chains[], addrs[])`: Register a new name with addresses for each chain.
- `getAddressForChain(name, chain)`: Resolve a name to an address for a given chain.
- `getAllAddresses(name)`: Get all linked addresses for a name.
- `updateAddresses(name, chains[], addrs[])`: Update addresses (when unlocked).
- `unlockUpdate(name)`: Unlock for editing (after 30 days).

## Frontend

`/frontend` will contain the Dapp for registering and managing `.bns` names. Stay tuned!

## License

MIT
