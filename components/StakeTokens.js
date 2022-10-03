import {
    stakingRewardsContractAddress,
    stakingRewardsABI,
    testToken0ContractAddress,
    testToken0ABI,
} from "../Constants"
import { Input } from "web3uikit"
import { useNotification } from "web3uikit"
import { useEffect } from "react"
import CustomContainer from "./CustomContainer"
import React from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useState } from "react"
import { FormControl, FormLabel, Button } from "@chakra-ui/react"

export default function StakeTokens() {
    const dispatch = useNotification()
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const stakingRewardAddress =
        chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
    const testToken0Address =
        chainId in testToken0ContractAddress ? testToken0ContractAddress[chainId][0] : null

    const [amountToStake, setAmountToStake] = useState("0")
    const [stakedTokens, setStakedTokens] = useState("0")
    const [totalSupply, setTotalSupply] = useState("0")
    const [allowance, setAllowance] = useState("0")
    const [withdrawAmount, setWithdrawAmount] = useState("0")
    const [balanceOfPlayerOfToken0, setBalanceOfPlayerOfToken0] = useState("0")

    const { runContractFunction: stakeTokens } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "stakeTokens",
        params: { _amount: amountToStake },
    })

    const { runContractFunction: getTokensStaked } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "getTokensStaked",
        params: { _account: account },
    })

    const { runContractFunction: getBalanceOfPlayerOfToken0 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "balanceOf",
        params: { account: account },
    })

    const { runContractFunction: withdrawTokens } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "withdrawTokens",
        params: { _amount: withdrawAmount },
    })

    const { runContractFunction: getAllowance } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "allowance",
        params: { owner: account, spender: stakingRewardAddress },
    })

    const { runContractFunction: getSupply } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "totalSupply",
        params: {},
    })

    const { runContractFunction: increaseAllowance } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "increaseAllowance",
        params: { spender: stakingRewardAddress, addedValue: totalSupply },
    })

    async function updateUI() {
        const balanceOfPlayerOfToken0FromCall = (await getBalanceOfPlayerOfToken0()).toString()
        const stakedTokensFromCall = (await getTokensStaked()).toString()
        const totalSupplyUpdated = (await getSupply()).toString()
        const allowanceUpdated = (await getAllowance()).toString()
        setAllowance(allowanceUpdated)
        setTotalSupply(totalSupplyUpdated)
        setBalanceOfPlayerOfToken0(balanceOfPlayerOfToken0FromCall)
        setStakedTokens(stakedTokensFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleStakeTokens = async (tx) => {
        await tx.wait(1)
        handleNotification(tx)
        setAmountToStake(amountToStake)
        updateUI()
    }

    const handleAllowance = async (tx) => {
        await tx.wait(1)
        handleNotification(tx)
        setAllowance(totalSupply)
        updateUI()
    }

    const handleWithdraw = async (tx) => {
        await tx.wait(1)
        handleNotification(tx)
        setWithdrawAmount(withdrawAmount)
        updateUI()
    }

    return (
        <CustomContainer>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    if (amountToStake !== "") {
                        if (allowance < totalSupply) {
                            increaseAllowance({
                                onError: (error) => {
                                    console.log(error)
                                },
                                onSuccess: handleAllowance,
                            })
                        } else {
                            stakeTokens({
                                onError: (error) => {
                                    console.log(error)
                                },
                                onSuccess: handleStakeTokens,
                            })
                        }
                    }
                }}
            >
                <FormControl mt="6" mb="6">
                    <FormLabel>Tokens to Stake</FormLabel>
                    <Input
                        label="Amount"
                        id="stake_tokens"
                        name="Stake tokens"
                        type="number"
                        onChange={(event) => {
                            setAmountToStake(event.target.value)
                        }}
                        placeholder={balanceOfPlayerOfToken0}
                    />
                </FormControl>
                <Button type="submit" colorScheme="purple">
                    Stake Tokens
                </Button>
            </form>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    console.log(withdrawAmount)
                    if (withdrawAmount !== "") {
                        withdrawTokens({
                            onError: (error) => {
                                console.log(error)
                            },
                            onSuccess: handleWithdraw,
                        })
                    }
                }}
            >
                <FormControl mt="6" mb="6">
                    <FormLabel>Tokens to Withdraw</FormLabel>
                    <Input
                        label="Amount"
                        id="withdraw_tokens"
                        name="Amount tokens"
                        type="number"
                        onChange={(event) => {
                            console.log(event.target.value)
                            setWithdrawAmount(event.target.value)
                        }}
                        placeholder={stakedTokens}
                    />
                </FormControl>
                <Button type="submit" colorScheme="purple" mb="6">
                    Withdraw Tokens
                </Button>
            </form>
        </CustomContainer>
    )
}
