import { ConnectButton } from "web3uikit"
import { Flex, Text, Button, Box, TabList, Tab, Tabs, TabPanels, TabPanel } from "@chakra-ui/react"
import Head from "next/head"
import { useMoralis } from "react-moralis"
import Header from "../components/Header"
import Profile from "../components/Profile"
import Balance from "../components/Balance"
import StakeTokens from "../components/StakeTokens"
import Rewards from "../components/Rewards"

export default function Home() {
    let { isAuthenticated, account, logout, isLoggingOut, authenticate } = useMoralis()
    if (!isAuthenticated) {
        return (
            <>
                <Head>
                    <title>Login | Dashboard</title>
                </Head>
                <Flex
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    width="100vw"
                    height="100vh"
                    bgGradient="linear(to-br,teal.400,purple.300)"
                >
                    <Text fontSize="5xl" fontWeight="bold" color="white">
                        Full Defi App
                    </Text>
                    <ConnectButton colorScheme="purple" size="lg" mt="6">
                        Login with Metamask
                    </ConnectButton>
                </Flex>
            </>
        )
    }
    return (
        <>
            <Head>
                <title>Defi App</title>
            </Head>
            <Flex direction="column" width="100vw" height="100vh">
                <Header user={account} logout={logout} isLoggingOut={isLoggingOut} />
                <Box flex="1" bgGradient="linear(to-br,teal.400,purple.300)" px="44" py="20">
                    <Tabs size="lg" colorScheme="purple" align="center" varian="enclosed">
                        <TabList>
                            <Tab fontWeight="bold">Profile</Tab>
                            <Tab fontWeight="bold">Balance</Tab>
                            <Tab fontWeight="bold">Stake Tokens</Tab>
                            <Tab fontWeight="bold">Withdraw Rewards</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Profile />
                            </TabPanel>
                            <TabPanel>
                                <Balance />
                            </TabPanel>
                            <TabPanel>
                                <StakeTokens />
                            </TabPanel>
                            <TabPanel>
                                <Rewards/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>
        </>
    )
}
