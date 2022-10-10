import CustomContainer from "./CustomContainer"
import { useWeb3Contract } from "react-moralis"
import {
    testToken0ContractAddress,
    testToken0ABI,
    testToken1ContractAddress,
    testToken1ABI,
    stakingRewardsABI,
    stakingRewardsContractAddress,
    ammSwapContractAddress,
    faucetAddresses
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
    const faucetAddress =
        chainId in faucetAddresses ? faucetAddresses[chainId][0] : null
    const testToken0Address =
        chainId in testToken0ContractAddress ? testToken0ContractAddress[chainId][0] : null
    const testToken1Address =
        chainId in testToken1ContractAddress ? testToken1ContractAddress[chainId][0] : null
    const AMMSwapAddress =
        chainId in ammSwapContractAddress ? ammSwapContractAddress[chainId][0] : null
    const [balanceOfPlayerOfToken0, setBalanceOfPlayerOfToken0] = useState("0")
    const [balanceOfContractOfToken0, setBalanceOfContractOfToken0] = useState("0")
    const [balanceOfContractOfToken1, setBalanceOfContractOfToken1] = useState("0")
    const [stakedBalanceOfToken0, setStakedBalanceOfToken0] = useState("0")
    const [balanceOfPlayerOfToken1, setBalanceOfPlayerOfToken1] = useState("0")
    const [balanceOfFaucetOfToken0,setBalanceOfFaucetOfToken0] = useState("0")
    const [balanceOfFaucetOfToken1,setBalanceOfFaucetOfToken1] = useState("0")

    const { runContractFunction: getBalanceOfPlayerOfToken0 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "balanceOf",
        params: { account: account },
    })

    const { runContractFunction: getBalanceOfFaucetOfToken0 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "balanceOf",
        params: { account: faucetAddress },
    })
    const { runContractFunction: getBalanceOfFaucetOfToken1 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "balanceOf",
        params: { account: faucetAddress },
    })


    const { runContractFunction: getBalanceOfPlayerOfToken1 } = useWeb3Contract({
        abi: testToken1ABI,
        contractAddress: testToken1Address,
        functionName: "balanceOf",
        params: { account: account },
    })

    const { runContractFunction: getBalanceOfContractOfToken0 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "balanceOf",
        params: { account: AMMSwapAddress },
    })

    const { runContractFunction: getBalanceOfContractOfToken1 } = useWeb3Contract({
        abi: testToken1ABI,
        contractAddress: testToken1Address,
        functionName: "balanceOf",
        params: { account: AMMSwapAddress },
    })

    const { runContractFunction: getTokensStaked } = useWeb3Contract({
        abi: stakingRewardsABI,
        contractAddress: stakingRewardAddress,
        functionName: "getTokensStaked",
        params: { _account: account },
    })

    async function updateUI() {
        const balanceOfPlayerOfToken0FromCall = (await getBalanceOfPlayerOfToken0()).toString()
        const balanceOfPlayerOfToken1FromCall = (await getBalanceOfPlayerOfToken1()).toString()
        const balanceOfContractOfToken0FromCal = (await getBalanceOfContractOfToken0()).toString()
        const balanceOfContractOfToken1FromCal = (await getBalanceOfContractOfToken1()).toString()
        const updatedStakedBalanceOfToken0 = (await getTokensStaked()).toString()
        const balanceOfToken0Faucet = (await getBalanceOfFaucetOfToken0()).toString()
        const balanceOfToken1Faucet = (await getBalanceOfFaucetOfToken1()).toString()
        setBalanceOfPlayerOfToken0(balanceOfPlayerOfToken0FromCall)
        setBalanceOfPlayerOfToken1(balanceOfPlayerOfToken1FromCall)
        setBalanceOfContractOfToken0(balanceOfContractOfToken0FromCal)
        setBalanceOfContractOfToken1(balanceOfContractOfToken1FromCal)
        setStakedBalanceOfToken0(updatedStakedBalanceOfToken0)
        setBalanceOfFaucetOfToken0(balanceOfToken0Faucet)
        setBalanceOfFaucetOfToken1(balanceOfToken1Faucet)
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
            <Text>Balance of Token#0: {balanceOfPlayerOfToken0.toString()} </Text>
            <Text>Balance of Token#1: {balanceOfPlayerOfToken1.toString()} </Text>
            <Text>Balance of Staked Token#0 : {stakedBalanceOfToken0.toString()} </Text>
            <Text>Liquidity pool balance of Token#0: {balanceOfContractOfToken0.toString()} </Text>
            <Text>Liquidity pool balance of Token#1: {balanceOfContractOfToken1.toString()} </Text>
            <Text>Faucet balance of Token#0: {balanceOfFaucetOfToken0.toString()} </Text>
            <Text>Faucet balance of Token#1: {balanceOfFaucetOfToken1.toString()} </Text>
        </CustomContainer>
    )
}

