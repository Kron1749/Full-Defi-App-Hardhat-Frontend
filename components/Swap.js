import {
    testToken0ContractAddress,
    testToken0ABI,
    testToken1ContractAddress,
    testToken1ABI,
    ammSwapContractAddress,
    ammSwapABI,
} from "../Constants"

import { Input, Form } from "web3uikit"
import { useNotification } from "web3uikit"
import { useEffect } from "react"
import CustomContainer from "./CustomContainer"
import React from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useState } from "react"
import {
    FormControl,
    FormLabel,
    Button,
    Select,
    InputGroup,
    InputLeftElement,
    InputRightAddon
} from "@chakra-ui/react"

export default function Swap() {
    const dispatch = useNotification()
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const testToken0Address =
        chainId in testToken0ContractAddress ? testToken0ContractAddress[chainId][0] : null
    const testToken1Address =
        chainId in testToken1ContractAddress ? testToken1ContractAddress[chainId][0] : null
    const ammSwapAddress =
        chainId in ammSwapContractAddress ? ammSwapContractAddress[chainId][0] : null

    const [amountToSwapToken, setAmountToSwapToken] = useState("0")
    const [tokenToSwap, setTokenToSwap] = useState("0")
    const [amountToGetFromSwap, seAmountToGetFromSwap] = useState("0")
    const [allowanceToken0, setAllowanceToken0] = useState("0")
    const [allowanceToken1, setAllowanceToken1] = useState("0")
    const [totalSupplyToken0, setTotalSupplyToken0] = useState("0")
    const [totalSupplyToken1, setTotalSupplyToken1] = useState("0")


    const { runContractFunction: swap } = useWeb3Contract({
        abi: ammSwapABI,
        contractAddress: ammSwapAddress,
        functionName: "swap",
        params: { _tokenIn: tokenToSwap, _amountIn: amountToSwapToken },
    })

    const { runContractFunction: increaseAllowanceForToken0 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "increaseAllowance",
        params: { spender: ammSwapAddress, addedValue: totalSupplyToken0 },
    })

    const { runContractFunction: increaseAllowanceForToken1 } = useWeb3Contract({
        abi: testToken1ABI,
        contractAddress: testToken1Address,
        functionName: "increaseAllowance",
        params: { spender: ammSwapAddress, addedValue: totalSupplyToken1 },
    })

    const { runContractFunction: getAllowanceToken0 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "allowance",
        params: { owner: account, spender: ammSwapAddress },
    })

    const { runContractFunction: getAllowanceToken1 } = useWeb3Contract({
        abi: testToken1ABI,
        contractAddress: testToken1Address,
        functionName: "allowance",
        params: { owner: account, spender: ammSwapAddress },
    })

    const { runContractFunction: getSupplyToken0 } = useWeb3Contract({
        abi: testToken0ABI,
        contractAddress: testToken0Address,
        functionName: "totalSupply",
        params: {},
    })

    const { runContractFunction: getSupplyToken1 } = useWeb3Contract({
        abi: testToken1ABI,
        contractAddress: testToken1Address,
        functionName: "totalSupply",
        params: {},
    })

    async function updateUI() {
        const totalSupplyForToken0FromCall = (await getSupplyToken0()).toString()
        const totalSupplyForToken1FromCall = (await getSupplyToken1()).toString()
        const allowanceForToken0FromCall = (await getAllowanceToken0()).toString()
        const allowanceForToken1FromCall = (await getAllowanceToken1()).toString()
        setAllowanceToken0(allowanceForToken0FromCall)
        setAllowanceToken1(allowanceForToken1FromCall)
        setTotalSupplyToken0(totalSupplyForToken0FromCall)
        setTotalSupplyToken1(totalSupplyForToken1FromCall)
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

    const handleAllowance = async (tx) => {
        await tx.wait(1)
        handleNotification(tx)
        setAllowanceToken0(totalSupplyToken0)
        setAllowanceToken1(totalSupplyToken1)
        updateUI()
    }
    const handleSwap = async (tx) => {
        await tx.wait(1)
        handleNotification(tx)
        updateUI()
    }

    return (
        <CustomContainer>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    if (tokenToSwap == testToken0Address) {
                        if (allowanceToken0 < totalSupplyToken0) {
                            increaseAllowanceForToken0({
                                onError: (error) => {
                                    console.log(error)
                                },
                                onSuccess: handleAllowance,
                            })
                        }
                    }
                    if (tokenToSwap == testToken1Address) {
                        if (allowanceToken1 < totalSupplyToken1) {
                            increaseAllowanceForToken1({
                                onError: (error) => {
                                    console.log(error)
                                },
                                onSuccess: handleAllowance,
                            })
                        }
                    }
                    swap({
                        onError: (error) => {
                            console.log(error)
                        },
                        onSuccess: handleSwap,
                    })
                }}
            >
                <FormControl mt="6" mb="6">
                    <FormLabel>Tokens to Swap</FormLabel>

                    <InputGroup size="md">
                    <InputRightAddon children={tokenToSwap != testToken0Address ? "Token1" : "Token0"} />
                        <Input
                            label="Amount"
                            id="swap_token_from"
                            name="Swap token From"
                            type="number"
                            placeholder={0}
                            onChange={(event) => {
                                setAmountToSwapToken(event.target.value)
                            }}
                        />
                        <InputLeftElement ml="80">
                            <Select
                                onChange={(event) => {
                                    if (event.target.value == "Token0") {
                                        setTokenToSwap(testToken0Address)
                                    } else {
                                        setTokenToSwap(testToken1Address)
                                    }
                                    
                                }}
                            >                 
                                <option>Token1</option>
                                <option>Token0</option>
                                
                            </Select>

                        </InputLeftElement>
                    </InputGroup>

                    <InputGroup size="md" mt="6">
                    <InputRightAddon children={tokenToSwap == testToken0Address ? "Token1" : "Token0"} />
                        <Input
                            label="Amount"
                            id="swap_token_to"
                            name="Swap token To"
                            type="number"
                            placeholder="0"
                        />
                        <InputLeftElement ml="80">
                            <Select>
                                <option>
                                    {tokenToSwap == testToken0Address ? "Token1" : "Token0"}
                                </option>
                            </Select>
                        </InputLeftElement>
                    </InputGroup>
                </FormControl>
                <Button type="submit" colorScheme="purple">
                    Swap Tokens
                </Button>
            </form>
        </CustomContainer>
    )
}

