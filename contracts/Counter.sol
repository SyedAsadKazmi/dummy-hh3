// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Counter {
  uint256 public x;

  constructor(uint256 _x) {
    x = _x;
  }

  function inc() public {
    x++;
  }
}
