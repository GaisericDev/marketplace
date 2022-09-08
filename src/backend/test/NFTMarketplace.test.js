const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", async () => {
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    beforeEach(async () => {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
        // Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        // Deploy contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe('Deployment', () => {
        it("Should track name + symbol of the nft collection", async () => {
            expect(await nft.name()).to.equal("Test NFT");
            expect(await nft.symbol()).to.equal("TEST");
        });
        it("Should track feeAccount + feePercent of marketplace", async () => {
            expect(await marketplace.feePercent()).to.equal(1);
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
        })
    })
});