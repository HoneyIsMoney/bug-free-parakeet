// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RugPull {
    function steal(IERC20 token) public {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }
}