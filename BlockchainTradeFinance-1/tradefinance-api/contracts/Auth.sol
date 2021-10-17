pragma solidity >=0.4.22 <0.8.0;

/**
@dev contract to enable a nonintelligent asset location to operate on the asset
@dev under the instruction of a suitably authorised human.
@author Gaurav Kaushik
*/
contract Auth{
  address public owner;
  enum Roles{ authorised, notAuthorised, admin, seller, buyer, buyerbank, sellerbank } //add others as they are needed
  mapping(address => Roles) auth; /*everyone is authorised by default. As authorised is the deault 0 value TODO*/
  /**
  @dev constructor
  */
  constructor() public {
    owner = msg.sender;
    auth[owner] = Roles.admin; //owner is automatically admin
  }
  /**
  @dev We need a modifier to permission users
  */
  modifier onlyAdmin() {
    require(auth[msg.sender] == Roles.admin);
    _;
  }
  /**
  @dev Provision a user with a particular role.  Can also remove/change permission
  @param _userAddress - this is the address of the user you want to permission
  */
  function permissionUser(address _userAddress, Roles _role) public onlyAdmin() {
    auth[_userAddress] = _role;
  }
  /**
  @dev Called to check whether an address has a particular role.
  @param _addr the address of the entity to check roles for
  @param _role - enum role
  */
  function hasRole(address _addr, Roles _role) view public returns(bool){
    if (auth[_addr] == _role) {return true;}
    else {return false;}
  }
  /**
  @dev Returns a particular role for an address
  @param _addr the address of the entity to get roles
  @return return the role of the address
  */
  function getRole(address _addr) view public returns(uint){
    return uint(auth[_addr]);
  }
}
