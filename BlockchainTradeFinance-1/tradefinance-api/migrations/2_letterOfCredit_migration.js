const LetterOfCredits = artifacts.require("./LetterOfCredits.sol");
module.exports = async function(deployer) {
  deployer.deploy(LetterOfCredits)
};
