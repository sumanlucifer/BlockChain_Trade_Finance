pragma solidity >=0.4.22 <0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title Letter Of Credit Work Flow
 * @author Gaurav Kaushik
 * @dev The Letter Of Credit Work Flow contract is meant to perform workflow of LC token.
 */

contract LCWorkFlow is ERC721 {
    constructor(string memory _name, string memory _symbol)
        public
        ERC721(_name, _symbol)
    {}

    /* LC Token WorkFlow Funcations */

    /**
     * Custom accessor to create a unique token
     */
    function mintUniqueTokenTo(address _to, uint256 _tokenId) public {
        super._mint(_to, _tokenId);
    }

    /**
     * Custom accessor to map IPFS file URI with token id
     */
    function setTokenURI(uint256 _tokenId, string memory _tokenURI) public {
        super._setTokenURI(_tokenId, _tokenURI);
    }

    /**
     * Custom accessor to burn a unique token
     */
    function burnLCToken(uint256 _tokenId) public {
        super._burn(_tokenId);
    }
}
