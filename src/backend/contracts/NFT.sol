// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "erc721a/contracts/ERC721A.sol";

contract NFT is ERC721A {
    constructor() ERC721A("Test NFT", "TEST") {}

    function mint(uint256 quantity) external payable {
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }
}