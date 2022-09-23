import { useWeb3Contract } from "react-moralis"
import {
    testTokenContractAddress,
    testTokenABI,
    stakingRewardsContractAddress,
} from "../Constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"

export default function getAmountOfTokens() {
    const { account } = useMoralis()
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
        params: { account: account },
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
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            {/* Balance Of Player is {balanceOfPlayer}
            Balance of Contract is {balanceOfContract} */}
        </div>
    )
}
