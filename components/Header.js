import { Button, Center, Flex, Text } from "@chakra-ui/react"
import { useMoralis } from "react-moralis"
export default function Header() {
    const { user, logout, isLoggingOut } = useMoralis()
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
                    <Button ml="4" colorScheme="purple" onClick={logout} disable={isLoggingOut}>
                        Logout
                    </Button>
                </Center>
            </Flex>
        </header>
    )
}
