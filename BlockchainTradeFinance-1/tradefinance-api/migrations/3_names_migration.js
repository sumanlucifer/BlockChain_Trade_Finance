var Names = artifacts.require("./Names.sol");

module.exports = function(deployer) {
  deployer.deploy(Names);
};
