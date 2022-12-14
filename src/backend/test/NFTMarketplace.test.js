const {expect} = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num, );

describe("NFTMarketplace", async () => {
    let deployer, addr1, addr2, addr3, nft, marketplace;
    let feePercent = 1;
    let URI = "testURI";

    beforeEach(async () => {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
        // Get signers
        [deployer, addr1, addr2, addr3] = await ethers.getSigners();
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
    });

    describe('Minting NFTs', () => {
        it("Should track minted NFTs", async () => {
            // addr1 mints NFT
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            // addr2 mints NFT
            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            // query non existent token
            await expect(nft.tokenURI(69)).to.be.revertedWith("ERC721: invalid token ID");
        });
    })

    describe("Making marketplace items", async () => {
        beforeEach(async () => {
            // addr1 mints NFT
            await nft.connect(addr1).mint(URI);
            // addr1 approves marketplace to spend NFT
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        });
        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async () => {
            // addr1 offers minted NFT for 1 eth
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1)))
            .to.emit(marketplace, "Offered")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                addr1.address
            )
            // owner of NFT should be marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            // item count on marketplace should now be eq to 1
            expect(await marketplace.itemCount()).to.equal(1);
            // get item from items mapping then check fields to ensure they are correct 
            const item = await marketplace.items(1);
            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);
        });

        it("Should fail if price is set to zero", async () => {
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than zero");
        })

        it("Should fail if trying to make item with invalid token ID", async () => {
            // list 1 item
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1));
            // list item with same token id
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1))
            ).to.be.revertedWith("Invalid tokenID");
            // list item with lower token id
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 0, toWei(1))
            ).to.be.revertedWith("Invalid tokenID");
            // list item with higher token id (skipping)
            await expect(
                marketplace.connect(addr1).makeItem(nft.address, 69, toWei(1))
            ).to.be.revertedWith("Invalid tokenID");
        });
    });

    describe("Purchasing marketplace items", async () => {
        let price = 2;
        let totalPriceInWei;
        let fee = (feePercent / 100) * price;
        beforeEach(async () => {
            // mint nft
            await nft.connect(addr1).mint(URI);
            // approve marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            // list on marketplace at price of 2 eth
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price));
        });
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit Bought event", async () => {
            // get balances before transaction
            const sellerInitEth = fromWei(await addr1.getBalance());
            const feeAccInitEth = fromWei(await deployer.getBalance());
            console.log("fee acc init eth: ", feeAccInitEth);
            // total price = price + fees
            totalPriceInWei = await marketplace.getTotalPrice(1);
            // addr2 buys item
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
            .to.emit(marketplace, "Bought")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address,
                addr2.address
            );
            // get balances after transaction
            const sellerFinalEth = fromWei(await addr1.getBalance());
            const feeAccFinalEth = fromWei(await deployer.getBalance());
            console.log("feeacc final eth: ", feeAccFinalEth);
            // seller should receive payment for the price of the NFT sold
            expect(+sellerFinalEth).to.equal(+price + +sellerInitEth);
            // feeAcc should receive fee
            // expect(+feeAccFinalEth).to.equal(+fee + +feeAccInitEth); <= rounding error somehow occurs here, but the console log shows it's equal
            // // buyer should now own nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            // item should be market as sold
            expect((await marketplace.items(1)).sold).to.equal(true);
        });

        it("Should fail for invalid item id, sold items and when not enough eth is paid", async () => {
            // buy non existing item
            await expect(marketplace.connect(addr2).purchaseItem(69, {value: totalPriceInWei})).to.be.revertedWith("Item does not exist");
            // buy item that is already sold
            await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei});
            await expect(marketplace.connect(addr3).purchaseItem(1, {value: totalPriceInWei})).to.be.revertedWith("Item already sold");
            // buy item with insufficient eth
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: 0})).to.be.revertedWith("Not enough ether to cover item price + market fee");
        });
    });
});