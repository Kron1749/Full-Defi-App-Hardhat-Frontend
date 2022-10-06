
const testToken0ContractAddress = require("./TestToken0/contractAddressesTestToken0.json")
const testToken0ABI = require("./TestToken0/abiTestToken0.json")
const testToken1ContractAddress = require("./TestToken1/contractAddressesTestToken1.json")
const testToken1ABI = require("./TestToken1/abiTestToken1.json")
const ammSwapContractAddress = require("./AMMSwap/contractAddressesAMMSwap.json")
const ammSwapABI = require("./AMMSwap/abiAMMSwap.json")
const stakingRewardsContractAddress = require("./StakingRewards/contractAddressesStakingRewards.json")
const stakingRewardsABI = require("./StakingRewards/abiStakingRewards.json")





// const stakingRewardAddress =
//         chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
//     const testToken0Address =
//         chainId in testToken0ContractAddress ? testToken0ContractAddress[chainId][0] : null
//     const testToken1Address =
//         chainId in testToken1ContractAddress ? testToken1ContractAddress[chainId][0] : null
//     const AMMSwapAddress =
//         chainId in ammSwapContractAddress ? ammSwapContractAddress[chainId][0] : null



module.exports = {
    // stakingRewardAddress,
    // testToken0Address,
    // testToken1Address,
    // AMMSwapAddress,
    testToken0ContractAddress,
    testToken0ABI,
    testToken1ContractAddress,
    testToken1ABI,
    ammSwapContractAddress,
    ammSwapABI,
    stakingRewardsContractAddress,
    stakingRewardsABI,
}
