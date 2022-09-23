//need function to stake tokens
import { useWeb3Contract } from "react-moralis"
import {
    stakingRewardsContractAddress,
    stakingRewardsABI,
    testTokenContractAddress,
    testTokenABI,
} from "../Constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification, Input } from "web3uikit"

export default function StakeEntrance() {
    const { account } = useMoralis()
    console.log(account)
    const dispatch = useNotification()
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const stakingRewardAddress =
        chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
    const testTokenAddress =
        chainId in testTokenContractAddress ? testTokenContractAddress[chainId][0] : null
    console.log(`At the beginiing ${stakingRewardAddress}`)
    const [tokensStaked, setTokensStaked] = useState("0")
    const [rewardsHave, setRewardsHave] = useState("0")

    const tokensToStake = 20
    const tokensToWithdraw = 5

    const { runContractFunction: increaseAllowance } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "increaseAllowance",
        params: { spender: stakingRewardAddress, addedValue: tokensToStake },
    })

    const {
        runContractFunction: stakeTokens,
        isLoadingStakeTokens,
        isFetchingStakeTokens,
    } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "stakeTokens",
        params: { _amount: tokensToStake },
    })

    const { runContractFunction: withdrawTokens } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "withdrawTokens",
        params: { _amount: tokensToWithdraw },
    })

    const { runContractFunction: withdrawRewards } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "withdrawRewards",
        params: {},
    })

    const { runContractFunction: updateRewardsStats } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "updateRewardsStats",
        params: {},
    })

    const { runContractFunction: getTokensStaked } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "getTokensStaked",
        params: { _account: account },
    })

    const { runContractFunction: getRewards } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "getRewards",
        params: { _account: account },
    })

    async function updateUI() {
        const tokenStakedUpdated = (await getTokensStaked()).toString()
        const rewardsUpdated = (await getRewards()).toString()
        setTokensStaked(tokenStakedUpdated)
        setRewardsHave(rewardsUpdated)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            <div class="flex space-x justify-center">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded ml-auto"
                    onClick={async function () {
                        await increaseAllowance({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                        await stakeTokens({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoadingStakeTokens || isFetchingStakeTokens}
                >
                    {isLoadingStakeTokens || isFetchingStakeTokens ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        <div>Stake tokens</div>
                    )}
                </button>

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded ml-auto"
                    onClick={async function () {
                        await updateRewardsStats({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoadingStakeTokens || isFetchingStakeTokens}
                >
                    {isLoadingStakeTokens || isFetchingStakeTokens ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        <div>Update Rewards</div>
                    )}
                </button>

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded ml-auto"
                    onClick={async function () {
                        await withdrawTokens({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoadingStakeTokens || isFetchingStakeTokens}
                >
                    {isLoadingStakeTokens || isFetchingStakeTokens ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        <div>Withdraw Tokens</div>
                    )}
                </button>

                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded ml-auto"
                    onClick={async function () {
                        await withdrawRewards({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoadingStakeTokens || isFetchingStakeTokens}
                >
                    {isLoadingStakeTokens || isFetchingStakeTokens ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        <div>withdrawRewards</div>
                    )}
                </button>
            </div>
            Tokens Staked {tokensStaked}
            Rewards Have {rewardsHave}
        </div>
    )
}
