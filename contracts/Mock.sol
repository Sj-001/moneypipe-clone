// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mock is ERC20 {
  constructor() ERC20("Mock", "MOCK"){

  }

  function mint(uint _qty) public {
    _mint(_msgSender(), _qty);
  }
}