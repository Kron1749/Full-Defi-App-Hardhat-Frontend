





import { Flex, Text, Button, Box, TabList, Tab, Tabs, TabPanels, TabPanel } from "@chakra-ui/react"
import Head from "next/head"
import { useMoralis } from "react-moralis"
import Header from "./Header"

export default function IsAuthenticated(){
    const {user,logout,isLoggingOut} = useMoralis()
    return (
        <>
            <Head>
                <title>Defi App</title>
            </Head>
            <Flex direction="column" width="100vw" height="100vh">
                <Header user={user} logout={logout} isLoggingOut={isLoggingOut} />
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
                                Profile
                            </TabPanel>
                            <TabPanel>Balance</TabPanel>
                            <TabPanel>Stake Tokens</TabPanel>
                            <TabPanel>Withdraw Rewards</TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>
        </>
    )
}