
import {
    stakingRewardsContractAddress,
    stakingRewardsABI,
    testTokenContractAddress,
    testTokenABI,
} from "../Constants"
import { Input } from "web3uikit"
import { useNotification } from "web3uikit"
import { useEffect } from "react"
import CustomContainer from "./CustomContainer"
import React from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useState } from "react"
import { FormControl, FormLabel, Button,Text } from "@chakra-ui/react"

export default function Rewards() {
    const dispatch = useNotification()
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const stakingRewardAddress =
        chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
    const testTokenAddress =
        chainId in testTokenContractAddress ? testTokenContractAddress[chainId][0] : null
    
    const [rewards,setRewards] = useState("0")

    const { runContractFunction: withdrawRewards } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "withdrawRewards",
        params: { },
    })

    const { runContractFunction: getRewards } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "getRewards",
        params: { _account:account},
    })

    const { runContractFunction: updateRewards } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "updateRewardsStats",
        params: {},
    })

    async function updateUI(){
        const rewardsUpdated = (await getRewards()).toString()
        setRewards(rewardsUpdated)
    }

    useEffect(() => {
        setTimeout(() => {
            if (isWeb3Enabled) {
                updateUI()
            }
        }, 100)
    })

    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleWithdrawRewards = async(tx) => {
        await tx.wait(1)
        handleNotification(tx)
        setRewards(rewards)
        updateUI()
    }

    const handleUpdateRewards = async(tx)=>{
        await tx.wait(1)
        handleNotification(tx)
        updateUI()
    }


    return (
  
        <CustomContainer>
                  <Text>Rewards: {rewards.toString()}</Text>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    withdrawRewards({
                        onError: (error) => {
                            console.log(error)
                        },
                        onSuccess: handleWithdrawRewards
                    })
                }}
            >
                <Button type="submit" colorScheme="purple" mt="3">
                    Withdraw rewards
                </Button>
            </form>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                        updateRewards({
                            onError: (error) => {
                                console.log(error)
                            },
                            onSuccess: handleUpdateRewards
                        })
                }}
            >
                <Button type="submit" colorScheme="purple" mb="6" ml="60" mt="-10">
                    Update Rewards
                </Button>
            </form>


        </CustomContainer>
    )
}