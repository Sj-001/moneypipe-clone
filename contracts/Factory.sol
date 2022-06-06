// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Stream.sol";

pragma solidity ^0.8.4;
contract Factory {
  event ContractDeployed(address indexed owner, address indexed group, string title);
  address public immutable implementation;
  constructor() {
    implementation = address(new Stream());
  }
  function genesis(string calldata title, Stream.Member[] calldata members) external returns (address) {
    address payable clone = payable(Clones.clone(implementation));
    Stream s = Stream(clone);
    s.initialize(members);
    emit ContractDeployed(msg.sender, clone, title);
    
    return clone;
  }
}


