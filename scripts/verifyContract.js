/**
 *  This script will calculate the constructor arguments for the `verify` function and call it.
 *  You can use this script to verify the contract on etherscan.io.
 */

 require('@nomiclabs/hardhat-etherscan')
 const hre = require('hardhat')
 const { MerkleTree } = require('merkletreejs')
 const keccak256 = require('keccak256')
 const whitelist = require('./whitelist.js')
 
 const BASE_URI = 'ipfs://QmZUZsAWXG1M9FJdrtUasd7s3oF4YrLfAKMiAk33h48h4X/'
 const proxyRegistryAddressMainnet = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'
 
 async function main() {
   // Calculate merkle root from the whitelist array
   const leafNodes = whitelist.map((addr) => keccak256(addr))
   const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
   const root = merkleTree.getRoot()
 
   await hre.run('verify:verify', {
     address: '0xBA047AB242D3259F0c22Ea65E288094093C0da9e', // Deployed contract address
     constructorArguments: [BASE_URI, root, proxyRegistryAddressMainnet]
   })
 }
 
 // We recommend this pattern to be able to use async/await everywhere
 // and properly handle errors.
 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })