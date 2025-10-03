// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BNS is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public lockPeriod = 30 days;

    struct Record {
        mapping(string => string) addresses; // chain => address (as string)
        uint256 lastUpdated;
        bool isLocked;
        string[] chains; // list of chains for enumeration
    }

    mapping(uint256 => Record) private records;
    mapping(string => uint256) public nameToTokenId;
    mapping(string => bool) public nameRegistered;

    constructor() ERC721("Based Name Service", "BNS") {}

    function register(
        string calldata name,
        string[] calldata chains,
        string[] calldata addrs
    ) public {
        require(!nameRegistered[name], "Name already registered");
        require(chains.length == addrs.length, "Mismatched arrays");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);

        nameToTokenId[name] = newTokenId;
        nameRegistered[name] = true;

        Record storage rec = records[newTokenId];
        for (uint i = 0; i < chains.length; i++) {
            rec.addresses[chains[i]] = addrs[i];
            rec.chains.push(chains[i]);
        }
        rec.lastUpdated = block.timestamp;
        rec.isLocked = true; // Lock on initial linking
    }

    function updateAddresses(
        string calldata name,
        string[] calldata chains,
        string[] calldata addrs
    ) public {
        uint256 tokenId = nameToTokenId[name];
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not the owner");
        Record storage rec = records[tokenId];

        require(
            !rec.isLocked || (block.timestamp - rec.lastUpdated) > lockPeriod,
            "Record is locked"
        );
        require(chains.length == addrs.length, "Mismatched arrays");

        for (uint i = 0; i < chains.length; i++) {
            rec.addresses[chains[i]] = addrs[i];
            bool exists = false;
            for (uint j = 0; j < rec.chains.length; j++) {
                if (keccak256(bytes(rec.chains[j])) == keccak256(bytes(chains[i]))) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                rec.chains.push(chains[i]);
            }
        }
        rec.lastUpdated = block.timestamp;
        rec.isLocked = true; // Relock after update
    }

    function unlockUpdate(string calldata name) public {
        uint256 tokenId = nameToTokenId[name];
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not the owner");
        Record storage rec = records[tokenId];
        require((block.timestamp - rec.lastUpdated) > lockPeriod, "Lock period not over");
        rec.isLocked = false;
    }

    function getAddressForChain(string calldata name, string calldata chain)
        public
        view
        returns (string memory)
    {
        uint256 tokenId = nameToTokenId[name];
        return records[tokenId].addresses[chain];
    }

    function getAllAddresses(string calldata name)
        public
        view
        returns (string[] memory chains, string[] memory addrs)
    {
        uint256 tokenId = nameToTokenId[name];
        Record storage rec = records[tokenId];
        uint256 len = rec.chains.length;
        chains = new string[](len);
        addrs = new string[](len);
        for (uint i = 0; i < len; i++) {
            chains[i] = rec.chains[i];
            addrs[i] = rec.addresses[chains[i]];
        }
    }
}
