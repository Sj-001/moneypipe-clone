const { expect } = require("chai");
const should = require("chai").should();
const { ethers } = require("hardhat");

const Stream = require("../artifacts/contracts/Stream.sol/Stream.json");

describe("Factory", function () {
  var factory, stream;
  var owner, addr1, addr2, mockERC20;
  var addr;
  before(async function () {
    [owner, addr1, addr2, ...addr] = await ethers.getSigners();

    var MockToken = await ethers.getContractFactory("Mock");
    mockERC20 = await MockToken.deploy();
    await mockERC20.deployed();
    var tx = await mockERC20.mint(500);
    await tx.wait();
    var Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy();

    await factory.deployed();
  });

  it("should create a new Stream", async function () {
    var tx = await factory.genesis("Pese Barobar", [
      [addr1.address, 1, 2],
      [addr2.address, 1, 2],
    ]);

    const rc = await tx.wait(); // 0ms, as tx is already confirmed
    rc.events = rc.events.find((event) => event.event === "ContractDeployed");
    var streamAddress = rc.events.args.group;
    stream = await ethers.getContractAtFromArtifact(Stream, streamAddress);
    should.exist(stream);
  });

  describe("Stream", function () {
    before(async function () {
      var tx = await mockERC20.transfer(stream.address, 100);
      await tx.wait();
    });
    it("should split the ether received between members", async function () {
      let amountInEther = "10";
      // Create a transaction object
      value = ethers.utils.parseEther(amountInEther);
      let tx = {
        to: stream.address,
        // Convert currency unit from ether to wei
        value: value,
      };
      initBalance1 = await addr1.getBalance();
      initBalance2 = await addr2.getBalance();
      tx = await owner.sendTransaction(tx);
      await tx.wait();
      finalBalance1 = await addr1.getBalance();
      finalBalance2 = await addr2.getBalance();
      diff1 = finalBalance1 - initBalance1;
      diff2 = finalBalance2 - initBalance2;

      expect(diff1).to.equal(diff2);
    });

    it("should split ERC20 balance on calling withdrawERC20 function", async function () {
      var tx = await stream.withdrawERC20(mockERC20.address);
      await tx.wait();

      expect(await mockERC20.balanceOf(addr1.address)).to.equal(50);
      expect(await mockERC20.balanceOf(addr2.address)).to.equal(50);
    });
  });
});
