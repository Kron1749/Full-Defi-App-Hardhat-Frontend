import {
    stakingRewardsContractAddress,
    stakingRewardsABI,
    testTokenContractAddress,
    testTokenABI,
} from "../Constants"

import { useEffect } from "react"
import { FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Input, Button, useToast } from "@chakra-ui/react";
import Moralis from "moralis";
import CustomContainer from "./CustomContainer";
import React from "react";
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useState } from "react"

export default function StakeTokens({user}) {
    console.log("Updated")
    const { chainId: chainIdHex, isWeb3Enabled,enableWeb3 } = useMoralis()
    const userAddress = user.get('ethAddress')
    const toast = useToast()
    const chainId = parseInt(chainIdHex)
    const stakingRewardAddress =
        chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
    const testTokenAddress =
        chainId in testTokenContractAddress ? testTokenContractAddress[chainId][0] : null

     const [amountToStake,setAmountToStake] = useState("0")   

    const {
        runContractFunction: stakeTokens,
    } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "stakeTokens",
        params: { _amount: amountToStake },
    })

    const {runContractFunction: getTokensStaked} = useWeb3Contract({
    abi: stakingRewardsABI,
    contractAddress: stakingRewardAddress,
    functionName: "getTokensStaked",
    params: { _account: userAddress }, 
})


    async function updateUI() {
        const tokenStakedUpdated = (await getTokensStaked()).toString()
        setAmountToStake(tokenStakedUpdated)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])
    

      

    const handleChange = (value) => setAmountToStake(value)

    return (
        <CustomContainer>
            <Text>Stake Tokens</Text>
            <form onSubmit={async e=>{
                e.preventDefault()
                // await Moralis.enableWeb3()
                fetch({
                    onSuccess: () => {
                        console.log("tested")
                        toast({
                            title: 'Tokens succesfully staked.',
                            description: "You successfully staked tokens",
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                          })
                          useEffect()
                          setAmountToStake(0)
                    },
                    onError: (error) => toast(
                        {
                            title: 'Error.',
                            description: error,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                          }
                    )
                })
            }}>
                <FormControl mt="4">
                    <FormLabel htmlFor='amountToStake'>Amount to stake</FormLabel>
                    <NumberInput  onChange={handleChange}>
                        <NumberInputField id='amountToStake' value={amountToStake} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
                <Button mt="4" type="submit" colorScheme="purple"  > Stake</Button>
            </form>
        </CustomContainer>
    )
}

































// const [amountTokensToStake, setAmountTokensToStake] = useState("0")


// // const { runContractFunction: increaseAllowance } = useWeb3Contract({
// //     abi: testTokenABI,
// //     contractAddress: testTokenAddress,
// //     functionName: "increaseAllowance",
// //     params: { spender: stakingRewardAddress, addedValue: totalBalance },
// // })

// const { runContractFunction: getAllowance } = useWeb3Contract({
//     abi: testTokenABI,
//     contractAddress: testTokenAddress,
//     functionName: "allowance",
//     params: { owner: userAddress, spender: stakingRewardAddress },
// })


// const { runContractFunction: getTotalSupply} = useWeb3Contract({
//     abi: testTokenABI,
//     contractAddress: testTokenAddress,
//     functionName: "totalSupply",
//     params: {},
// })

// const {runContractFunction: getTokensStaked} = useWeb3Contract({
//     abi: stakingRewardsABI,
//     contractAddress: stakingRewardAddress,
//     functionName: "getTokensStaked",
//     params: { _account: userAddress }, 
// })