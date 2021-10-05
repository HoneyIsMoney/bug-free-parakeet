import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';

import { rugpull } from "./testHelpers";
import { EVMcrispr } from '@commonsswarm/evmcrispr';
const log = console.log
const agentWhale = "0xA377585abED3E943e58174b55558A2482894ce20";
const agve = "0x3a97704a1b25F08aa230ae53B352e2e72ef52843";
const oldDAO = "0xd3b4048623028cD1E09Ab5192eB2612E9ce339d2"
const oldVoting = '0x5dcdf85f1b00ae648233d77e4a9879dad3a89563'
const hornetVesting = '0x2abeb846160b92ecc9b4773e2d95df4766a52eb9'

const main = async () => {

  // 0. get signer
  const signer = (await ethers.getSigners())[0];

  // 1. mock xdai network id for crispr
  signer.getChainId = () => {
    return new Promise((resolve,) => {
      resolve(100)
    })
  }
  log('signer: ', signer.address)

  // 3. get get some agve
  // const Agve = await ethers.getContractAt("IERC20", agve, signer);
  // const tokensToSteal = await Agve.balanceOf(agentWhale);
  // console.log('steal:  ', tokensToSteal.toString())
  // await rugpull(agentWhale, agve);
  // const signerAfter = await Agve.balanceOf(signer.address);
  // console.log('stolen: ', signerAfter.toString())


  // 4. create vote
  const evmcrispr = await EVMcrispr.create(signer, oldDAO, { ipfsGateway: 'https://ipfs.io/ipfs' })
  
  
  const appCache: any= evmcrispr.appCache.entries()

 const v =  appCache.return('voting:0')
  const tx = await evmcrispr.forward(
    [evmcrispr.act('agent', hornetVesting, 'revoke()', [])],
    ['hooked-token-manager.open', 'voting'],
    { context: 'revoke hornet vesting' }
  )
  log("vote created?", tx.status === 1)

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
