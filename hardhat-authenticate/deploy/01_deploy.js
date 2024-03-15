const {networkConfig, developmentChains} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const {verify} = require("../utils/verify");

module.exports = async ({getNamedAccounts , deployments}) => {
    const {deploy , log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;
    const authenticate = await deploy("Certificate_Authentication",{
        from : deployer,
        log : true,
        waitConfirmations : network.config.blockConfirmations || 1,
    });

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(authenticate.address);
    }

    log("====================================");

}
module.exports.tags = ["all" , "authenticate"];