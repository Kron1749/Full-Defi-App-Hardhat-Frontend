import { Button, Center, Flex, Text } from "@chakra-ui/react"
import { useMoralis } from "react-moralis"
import { useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import {
    faucetAddresses,
    faucetAbi,
} from "../Constants"

export default function Header() {
    const dispatch = useNotification()
    const { chainId: chainIdHex,user, logout, isLoggingOut} = useMoralis()
    const chainId = parseInt(chainIdHex)
    
    const faucetAddress =
        chainId in faucetAddresses ? faucetAddresses[chainId][0] : null

    const handleFaucetToken = async (tx) => {
        await tx.wait(1)
        handleNotification(tx)
    }

    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    function faucetTokens() {
        getFaucetTokens({
            onError: (error) => {
                console.log(error)
            },
            onSuccess: handleFaucetToken,
        })
    }
    
    const { runContractFunction: getFaucetTokens } = useWeb3Contract({
        abi: faucetAbi,
        contractAddress: faucetAddress,
        functionName: "faucet",
        params: {},
    })

    return (
        <header>
            <Flex px="10" py="6" justifyContent="space-between" bg="purple.100" color="white">
                <Center>
                    <Text fontSize="xl" fontWeight="bold">
                        Full Defi App
                    </Text>
                </Center>
                <Center>
                    <Text>{user.getUsername()}</Text>
                    <Button ml="4" colorScheme="purple" onClick={faucetTokens} disable={isLoggingOut}>
                        Faucet
                    </Button>
                    <Button ml="4" colorScheme="purple" onClick={logout} disable={isLoggingOut}>
                        Logout
                    </Button>
                </Center>
            </Flex>
        </header>
    )
}
