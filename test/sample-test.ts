const { expect } = require("chai");
import { ethers, network } from "hardhat";
import { rugPullContract } from "./testHelpers";
import { EVMcrispr } from '@commonsswarm/evmcrispr'

const agentWhale = "0xA377585abED3E943e58174b55558A2482894ce20";
const agve = "0x3a97704a1b25F08aa230ae53B352e2e72ef52843";
const oldDAO = "0xd3b4048623028cD1E09Ab5192eB2612E9ce339d2"
const hornetVesting = '0x2abeb846160b92ecc9b4773e2d95df4766a52eb9'

export async function rugpull(account: string, token: string) {
  const signer = (await ethers.getSigners())[0];
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [account],
  });
  const impersonate = await ethers.getSigner(account);
  const Token = await ethers.getContractAt("IERC20", token, impersonate);
  const tokensToRug = await Token.balanceOf(account);
  await signer.sendTransaction({
    to: impersonate.address,
    value: ethers.BigNumber.from(1e18.toString()),
  });
  await Token.transfer(signer.address, tokensToRug);
}

describe("rugpull AGVE", async function () {

  // it("should rugpull the agent", async () => {
  //   const signer = (await ethers.getSigners())[0];

  //   const Agve = await ethers.getContractAt("IERC20", agve, signer);

  //   const tokensToSteal = await Agve.balanceOf(agentWhale);
  //   await rugpull(agentWhale, agve);
  //   const signerAfter = await Agve.balanceOf(signer.address);

  //   expect(signerAfter).to.equal(tokensToSteal);
  // });

  it("Create Vote in old dao", async function () {
    const signer = (await ethers.getSigners())[0]
    signer.getChainId = () => {
      return new Promise((resolve,) => {
        resolve(100)
      })
    }
    const evmcrispr = await EVMcrispr.create(signer, oldDAO, { ipfsGateway: 'https://ipfs.io/ipfs' })

    await rugpull(agentWhale, agve);

    const tx = await evmcrispr.forward(
      [evmcrispr.act('agent', hornetVesting, 'revoke()', [])],
      ['hooked-token-manager.open', 'voting'],
      { context: 'revoke hornet vesting' }
    )

    expect(tx.status).to.equal(1)

  });
})
