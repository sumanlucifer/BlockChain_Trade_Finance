const LCWorkFlow = artifacts.require("./LCWorkFlow.sol");
module.exports = async function(deployer) {
  await deployer.deploy(LCWorkFlow, "LetterOfCredit Token", "LOC")
  const erc721 = await LCWorkFlow.deployed()
};