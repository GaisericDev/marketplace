// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard{
    //State variables
    address payable public immutable feeAccount; // acc that has to receive fees
    uint public immutable feePercent; // % on sales
    uint public itemCount;

    struct Item{
        uint itemId;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
        IERC721 nft;
    }

    event Offered (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    // itemId => Item
    mapping(uint => Item) public items;

    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // increment itemCount
        itemCount ++;
        items[itemCount -1] = Item (
            itemCount -1,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            _nft
        );

        emit Offered(
            itemCount -1,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }
}