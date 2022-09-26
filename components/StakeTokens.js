import {
    stakingRewardsContractAddress,
    stakingRewardsABI,
    testTokenContractAddress,
    testTokenABI,
} from "../Constants"
import { Modal, Input } from "web3uikit"
import { useNotification } from "web3uikit"
import { useEffect } from "react"
import CustomContainer from "./CustomContainer"
import React from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useState } from "react"
import { FormControl, FormLabel, Button } from "@chakra-ui/react"

export default function StakeTokens() {
    console.log("Updated")
    const dispatch = useNotification()
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    console.log(`WEB3 IS ${isWeb3Enabled}`)
    const chainId = parseInt(chainIdHex)
    const stakingRewardAddress =
        chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
    const testTokenAddress =
        chainId in testTokenContractAddress ? testTokenContractAddress[chainId][0] : null

    const [amountToStake, setAmountToStake] = useState("0")
    const [totalSupply, setTotalSupply] = useState("0")
    const [allowance, setAllowance] = useState("0")

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

    const { runContractFunction: getAllowance } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "allowance",
        params: { owner: account, spender: stakingRewardAddress },
    })

    const { runContractFunction: getSupply } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "totalSupply",
        params: {},
    })

    const { runContractFunction: increaseAllowance } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "increaseAllowance",
        params: { spender: stakingRewardAddress, addedValue: totalSupply },
    })

    async function updateUI() {
        const tokenStakedUpdated = (await getTokensStaked()).toString()
        const totalSupplyUpdated = (await getSupply()).toString()
        const allowanceUpdated = (await getAllowance()).toString()
        setAllowance(allowanceUpdated)
        setTotalSupply(totalSupplyUpdated)
        setAmountToStake(tokenStakedUpdated)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleNotificationStake = function () {
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
        handleNotificationStake(tx)
        setAmountToStake("0")
        updateUI()
    }

    const handleAllowance = async (tx) => {
        await tx.wait(1)
        handleNotificationStake(tx)
        setAllowance(totalSupply)
        updateUI()
    }

    return (
        <CustomContainer>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    console.log(amountToStake)
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
                        label="Stake tokens"
                        name="Stake tokens"
                        type="number"
                        onChange={(event) => {
                            setAmountToStake(event.target.value)
                        }}
                    />
                </FormControl>
                <Button type="submit" colorScheme="purple">
                    Stake Tokens
                </Button>
            </form>
        </CustomContainer>
    )
}
