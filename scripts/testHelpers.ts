import { Contract } from 'ethers';
import { Result } from 'ethers/lib/utils';
import { ethers, network } from 'hardhat';

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

export async function timeTravel(seconds: string) {
  await network.provider.send("evm_increaseTime", [seconds]);
  await network.provider.send("evm_mine", []);
}

export const filterContractEvents = (
  contract: Contract,
  selectedFilter: string,
  transactionHash?: string
): Promise<Result> => {
  return new Promise((resolve, reject) => {
    const filter = contract.filters[selectedFilter];

    if (!filter) {
      reject(new Error(`Selected filter ${selectedFilter} doesn't exists`));
    }

    contract
      .queryFilter(filter())
      .then((events) => {
        if (transactionHash) {
          const filteredEvent:any = events.filter(
            (event) => event.transactionHash === transactionHash
          );
          resolve(filteredEvent[0]?.args);
        } else {
          resolve(events);
        }
      })
      .catch((err) => reject(err));
  });
};

export {}
