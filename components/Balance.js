import CustomContainer from "./CustomContainer"
import { useWeb3Contract } from "react-moralis"
import {
    testTokenContractAddress,
    testTokenABI,
    stakingRewardsContractAddress,
} from "../Constants"
import { Text} from "@chakra-ui/react"
import { useState } from "react"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function Profile({user}) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const stakingRewardAddress =
        chainId in stakingRewardsContractAddress ? stakingRewardsContractAddress[chainId][0] : null
    const testTokenAddress =
        chainId in testTokenContractAddress ? testTokenContractAddress[chainId][0] : null

    const [balanceOfPlayer, setBalanceOfPlayer] = useState("0")
    const [balanceOfContract, setBalanceOfContract] = useState("0")

    const { runContractFunction: getBalanceOfPlayer } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "balanceOf",
        params: { account: user.get('ethAddress') },
    })

    const { runContractFunction: getBalanceOfContract } = useWeb3Contract({
        abi: testTokenABI,
        contractAddress: testTokenAddress,
        functionName: "balanceOf",
        params: { account: stakingRewardAddress },
    })

    async function updateUI() {
        const balanceOfPlayerFromCall = (await getBalanceOfPlayer()).toString()
        const balanceOfContractFromCal = (await getBalanceOfContract()).toString()
        setBalanceOfPlayer(balanceOfPlayerFromCall)
        setBalanceOfContract(balanceOfContractFromCal)
    }

    useEffect(() => {
        setTimeout(() => {
            if (isWeb3Enabled) {
                updateUI()
                console.log("Up updated")
            }
        }, 10000);
      });


    return (
        <CustomContainer>            
            <Text>Balance of User: {balanceOfPlayer} </Text>
            <Text>Contract balance: {balanceOfContract} </Text>
        </CustomContainer>
    )
}