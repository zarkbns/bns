const { expect } = require("chai");

describe("BNS — Based Name Service", function () {
  let BNS, bns, owner, alice, bob;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    BNS = await ethers.getContractFactory("BNS");
    bns = await BNS.deploy();
    await bns.deployed();
  });

  it("should register a name and link addresses for multiple chains", async function () {
    // Register 'alice.bns' with ETH and BTC addresses
    const name = "alice";
    const chains = [1, 2]; // Example: 1=ETH, 2=BTC
    const addrs = [
      "0x1234567890123456789012345678901234567890", // ETH address
      "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080" // BTC address
    ];

    await bns.connect(alice).register(name, chains, addrs);

    // Check NFT ownership
    expect(await bns.ownerOf(await bns.nameToTokenId(name))).to.equal(alice.address);

    // Resolve address for ETH
    expect(await bns.getAddressForChain(name, 1)).to.equal(addrs[0]);
    // Resolve address for BTC
    expect(await bns.getAddressForChain(name, 2)).to.equal(addrs[1]);
  });

  it("should get all linked addresses for a name", async function () {
    const name = "bob";
    const chains = [1, 2];
    const addrs = [
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", // ETH
      "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080" // BTC
    ];
    await bns.connect(bob).register(name, chains, addrs);

    const allAddrs = await bns.getAllAddresses(name);
    expect(allAddrs.length).to.equal(2);
    expect(allAddrs[0]).to.equal(addrs[0]);
    expect(allAddrs[1]).to.equal(addrs[1]);
  });

  it("should NOT allow address update before unlock", async function () {
    const name = "alice";
    const chains = [1];
    const addr1 = ["0x1234567890123456789012345678901234567890"];
    await bns.connect(alice).register(name, chains, addr1);

    // Try to update address before unlock
    await expect(
      bns.connect(alice).updateAddresses(name, chains, ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"])
    ).to.be.revertedWith("Edit locked");
  });

  it("should unlock editing after 30 days and allow address update", async function () {
    const name = "alice";
    const chains = [1];
    const addr1 = ["0x1234567890123456789012345678901234567890"];
    await bns.connect(alice).register(name, chains, addr1);

    // Fast-forward 30 days (2592000 seconds)
    await ethers.provider.send("evm_increaseTime", [2592000]);
    await ethers.provider.send("evm_mine", []);

    // Unlock update
    await bns.connect(alice).unlockUpdate(name);

    // Update address
    const newAddr = ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"];
    await bns.connect(alice).updateAddresses(name, chains, newAddr);

    expect(await bns.getAddressForChain(name, 1)).to.equal(newAddr[0]);
  });
});
