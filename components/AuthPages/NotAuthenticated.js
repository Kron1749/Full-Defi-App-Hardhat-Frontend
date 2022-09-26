import { Flex, Text, Button} from "@chakra-ui/react"
import Head from "next/head"
import { useMoralis } from "react-moralis"

export default function NotAuthenticated(){
    const { authenticate} = useMoralis()
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
                    <Button
                        colorScheme="purple"
                        size="lg"
                        mt="6"
                        onClick={() =>
                            authenticate({
                                signingMessage: "Sign to login to App",
                            })
                        }
                    >
                        Login with Metamask
                    </Button>
                </Flex>
            </>
    )
}