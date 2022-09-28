import CustomContainer from "./CustomContainer"
import { useWeb3Contract } from "react-moralis"
import {
    testTokenContractAddress,
    testTokenABI,
    stakingRewardsABI,
    stakingRewardsContractAddress,
} from "../Constants"
import { Text } from "@chakra-ui/react"
import { useState } from "react"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function Profile() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const stakingRewardAddress =
        chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
    const testTokenAddress =
        chainId in testTokenContractAddress ? testTokenContractAddress[chainId][0] : null

    const [balanceOfPlayer, setBalanceOfPlayer] = useState("0")
    const [balanceOfContract, setBalanceOfContract] = useState("0")
    const [stakedBalance,setStakedBalance] = useState("0")

    const { runContractFunction: getBalanceOfPlayer } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "balanceOf",
        params: { account: account },
    })

    const { runContractFunction: getBalanceOfContract } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "balanceOf",
        params: { account: stakingRewardAddress },
    })

    const { runContractFunction: getTokensStaked } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "getTokensStaked",
        params: { _account: account },
    })

    async function updateUI() {
        const balanceOfPlayerFromCall = (await getBalanceOfPlayer()).toString()
        const balanceOfContractFromCal = (await getBalanceOfContract()).toString()
        const updatedStakedBalance = (await getTokensStaked()).toString()
        setBalanceOfPlayer(balanceOfPlayerFromCall)
        setBalanceOfContract(balanceOfContractFromCal)
        setStakedBalance(updatedStakedBalance)
    }

    useEffect(() => {
        setTimeout(() => {
            if (isWeb3Enabled) {
                updateUI()
            }
        }, 100)
    })

    return (
        <CustomContainer>
            <Text>Balance of User: {balanceOfPlayer.toString()} </Text>
            <Text>Contract balance: {balanceOfContract.toString()} </Text>
            <Text>Staked tokens: {stakedBalance.toString()} </Text>
        </CustomContainer>
    )
}
