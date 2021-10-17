pragma solidity >=0.4.22 <0.8.0;

/**
 * @title Letter Of Credit
 * @author Gaurav Kaushik
 * @dev The Letter Of Credit contract is meant to create, update and read a Letter Of Credit.
 */

contract LetterOfCredits {
    struct LetterOfCredit {
        uint256 LCId;
        bytes32 LCTokenNumber;
        address OwnerAddress;
        string BuyerMetadata;
        string SellerMetadata;
        string ProductMetadata;
        bytes32 LCStatus;
        bytes32 LCTimestamp;
    }

    struct LCID {
        uint256 LCId;
    }

    struct LCTokenURI {
        string TokenURI;
    }

    event createLCEvent(
        uint256 LCId,
        bytes32 LCTokenNumber,
        address OwnerAddress,
        string BuyerMetadata,
        string SellerMetadata,
        string ProductMetadata,
        bytes32 LCStatus,
        bytes32 LCTimestamp
    );

    event updateLCEvent(
        uint256 LCId,
        bytes32 LCTokenNumber,
        string ProductMetadata,
        bytes32 LCStatus,
        bytes32 LCTimestamp
    );

    LetterOfCredit[] public LetterOfCreditArray;
    mapping(uint256 => LetterOfCredit) letterOfCredits;

    LCID[] public LCIDArray;
    mapping(bytes32 => LCID) lcIDs;

    LCTokenURI[] public TokenURIArray;
    mapping(uint256 => LCTokenURI) tokenURIs;

    uint256 public counter = 1;

    function createLC(
        bytes32 LCTokenNumber,
        address OwnerAddress,
        string memory BuyerMetadata,
        string memory SellerMetadata,
        string memory ProductMetadata,
        bytes32 LCStatus,
        bytes32 LCTimestamp
    ) public returns (uint256) {
        uint256 LCId = counter;
        uint256 LCTokenNumber = counter;

        letterOfCredits[LCId].LCId = LCId;
        letterOfCredits[LCId].LCTokenNumber = LCTokenNumber;
        letterOfCredits[LCId].OwnerAddress = OwnerAddress;
        letterOfCredits[LCId].BuyerMetadata = BuyerMetadata;
        letterOfCredits[LCId].SellerMetadata = SellerMetadata;
        letterOfCredits[LCId].ProductMetadata = ProductMetadata;
        letterOfCredits[LCId].LCStatus = LCStatus;
        letterOfCredits[LCId].LCTimestamp = LCTimestamp;
        lcIDs[LCTokenNumber].LCId = LCId;

        LetterOfCreditArray.push(letterOfCredits[LCId]);
        LCIDArray.push(lcIDs[LCTokenNumber]);
        counter++;
        emit createLCEvent(
            letterOfCredits[LCId].LCId,
            letterOfCredits[LCId].LCTokenNumber,
            letterOfCredits[LCId].OwnerAddress,
            letterOfCredits[LCId].BuyerMetadata,
            letterOfCredits[LCId].SellerMetadata,
            letterOfCredits[LCId].ProductMetadata,
            letterOfCredits[LCId].LCStatus,
            letterOfCredits[LCId].LCTimestamp
        );

        return LCId;
    }

    function readLC(uint256 LCId)
        public
        view
        returns (
            bytes32 LCTokenNumber,
            address OwnerAddress,
            string memory ProductMetadata,
            bytes32 LCStatus,
            bytes32 LCTimestamp,
            string memory BuyerMetadata,
            string memory SellerMetadata
        )
    {
        LetterOfCredit memory loc = letterOfCredits[LCId];
        return (
            loc.LCTokenNumber,
            loc.OwnerAddress,
            loc.ProductMetadata,
            loc.LCStatus,
            loc.LCTimestamp,
            loc.BuyerMetadata,
            loc.SellerMetadata
        );
    }

    function updateLCStatus(
        uint256 LCId,
        bytes32 LCStatus,
        bytes32 LCTimestamp
    ) public returns (uint256) {
        letterOfCredits[LCId].LCStatus = LCStatus;
        letterOfCredits[LCId].LCTimestamp = LCTimestamp;
        LetterOfCreditArray.push(letterOfCredits[LCId]);

        return LCId;
    }

    function updateLCOwnerAndStatus(
        uint256 LCId,
        address OwnerAddress,
        bytes32 LCStatus,
        bytes32 LCTimestamp
    ) public returns (uint256) {
        letterOfCredits[LCId].OwnerAddress = OwnerAddress;
        letterOfCredits[LCId].LCStatus = LCStatus;
        letterOfCredits[LCId].LCTimestamp = LCTimestamp;
        LetterOfCreditArray.push(letterOfCredits[LCId]);

        return LCId;
    }

    function setLCTokenURI(uint256 LCId, string memory TokenURI)
        public
        returns (uint256)
    {
        tokenURIs[LCId].TokenURI = TokenURI;
        TokenURIArray.push(tokenURIs[LCId]);

        return LCId;
    }

    function getLCIDArrayLength() public view returns (uint256) {
        return (LCIDArray.length);
    }

    function getLetterOfCreditArrayLength() public view returns (uint256) {
        return (LetterOfCreditArray.length);
    }

    /* Get LCID from LCTokenNumber */
    function getLCId(bytes32 LCTokenNumber) public view returns (uint256 LCId) {
        LCID memory loc = lcIDs[LCTokenNumber];
        return (loc.LCId);
    }

    function getLCTokenURI(uint256 LCId)
        public
        view
        returns (string memory TokenURI)
    {
        LCTokenURI memory lcUri = tokenURIs[LCId];
        return (lcUri.TokenURI);
    }
}

/* This funcationality is not required for POC */
/*  function updateLC(
        uint256 LCId,
        bytes32 LCTokenNumber,
        string memory ProductMetadata,
        bytes32 LCStatus
    ) public returns (uint256) {
        letterOfCredits[LCId].ProductMetadata = ProductMetadata;
        letterOfCredits[LCId].LCStatus = LCStatus;
        LetterOfCreditArray.push(letterOfCredits[LCId]);
        emit updateLCEvent(
            letterOfCredits[LCId].LCId,
            letterOfCredits[LCId].LCTokenNumber,
            letterOfCredits[LCId].ProductMetadata,
            letterOfCredits[LCId].LCStatus
        );

        return LCId;
    }*/
