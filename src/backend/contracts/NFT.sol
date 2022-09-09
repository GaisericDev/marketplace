// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "erc721a/contracts/ERC721A.sol";
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721A, Ownable {
    using Address for address;
    using Strings for uint256;
    string public baseURI = "";

    constructor(string memory _baseURI) ERC721A("Test NFT", "TEST") {
        baseURI = _baseURI;
    }

    function mint(uint256 quantity) external payable {
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }

    function tokenURI(
        uint256 _tokenId
    )   
        virtual
        override 
        public 
        view 
        returns (
            string memory
        ) 
    {
        // Make sure that the token has been minted
        if(!_exists(_tokenId)) revert("Token non existent");
        return string(
            abi.encodePacked(
                 baseURI
                ,"/"
                ,_tokenId.toString()
                ,".json"
                )
            );
    }
}