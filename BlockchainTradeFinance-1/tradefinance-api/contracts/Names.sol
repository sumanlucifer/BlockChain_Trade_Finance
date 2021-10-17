pragma solidity >=0.4.22 <0.8.0;

/**
 * @title Names Smart Contract
 * @author Gaurav Kaushik
 * @dev Stores friendly names for accounts.
 */

contract Names {
    struct user {
        string name;
        address addr;
        string Location;
        bool valid;
    }

    //mapping(address => string) private names;

    mapping(bytes32 => user) private users;

    mapping(address => string) private userNames;

    bytes32[] userArr; // array of user emails

    /**
    @dev Constructor - gives the contract creator the friendly name "Owner"
    */

    constructor() public {
        users["owner"].name = "Owner";
        users["owner"].addr = msg.sender;
        userArr.push("owner");
        userNames[msg.sender] = "Owner";
    }

    /**
    @dev Get the array of users
     */
    function getUserArr() public view returns (bytes32[] memory) {
        return userArr;
    }

    function isValidUser(bytes32 _userName) private view returns (bool) {
        return users[_userName].valid;
    }

    /**
    @dev Store a friendly name and address which mapps with email
    @param _userName - the userName of user
    @param _name - name of the use
    */
    function setUser(
        bytes32 _userName,
        address _from,
        string memory _name,
        string memory Location
    ) public returns (bool) {
        assert(isValidUser(_userName) != true);
        users[_userName].name = _name;
        users[_userName].addr = _from;
        users[_userName].Location = Location;
        users[_userName].valid = true;
        userArr.push(_userName);
        userNames[_from] = _name;
        return true;
    }

    /**
    @dev Retrieve the friendly name
    @param _userName - the userName of user
    @return name - the corresponding friendly name
    @return addr - address of the use
    */
    function getUser(bytes32 _userName)
        public
        view
        returns (
            string memory,
            address,
            string memory
        )
    {
        return (
            users[_userName].name,
            users[_userName].addr,
            users[_userName].Location
        );
    }

    /**
    @dev Retrieve the friendly name
    @param _address - The address of user
    @return name -The name os the user
    */
    function getUserName(address _address) public view returns (string memory) {
        return userNames[_address];
    }
}
