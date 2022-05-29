/**
 *  This script will calculate the constructor arguments for BearCoffee.sol and deploy it.
 *  After deploying, you can access the contract on etherscan.io with the deployed contract address.
 */

 const hre = require('hardhat')
 const { MerkleTree } = require('merkletreejs')
 const keccak256 = require('keccak256')
 const whitelist = require('./whitelist.js')
 
 const BASE_URI = 'ipfs://QmPVezw2F3TJ4GjXRR246D64vk4WC1GCqob4c7eDEL8CQv/'
 const proxyRegistryAddressMainnet = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'
 
 async function main() {
   // Calculate merkle root from the whitelist array
   const leafNodes = whitelist.map((addr) => keccak256(addr))
   const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
   const root = merkleTree.getRoot()
 
   // Deploy the contract
   const BearCoffees = await hre.ethers.getContractFactory('BearCoffee')
   const bearCoffees = await BearCoffees.deploy(
     BASE_URI,
     root,
     proxyRegistryAddressMainnet
   )
 
   await bearCoffees.deployed()
 
   console.log('BearCoffees deployed to:', bearCoffees.address)
 }
 
 // We recommend this pattern to be able to use async/await everywhere
 // and properly handle errors.
 main()
   .then(() => process.exit(0))
   .catch((error) => {
     console.error(error)
     process.exit(1)
   })