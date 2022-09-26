import CustomContainer from "./CustomContainer"
import { Button, FormControl, FormLabel, Text, Input } from "@chakra-ui/react"
import { useState } from "react"
import { useMoralis } from "react-moralis"

export default function Profile() {
    const { user } = useMoralis()
    const [input, setInput] = useState("")
    const { setUserData, isUserUpdating } = useMoralis()
    return (
        <CustomContainer>
            <Text>Username: {user.getUsername()} </Text>
            <Text>Wallet address: {user.get("ethAddress")} </Text>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    if (input.trim() !== "") {
                        setUserData({
                            username: input,
                        }).then(() => setInput(""))
                    }
                }}
            >
                <FormControl mt="6" mb="6">
                    <FormLabel htmlFor="username">Set a new username</FormLabel>
                    <Input
                        id="username"
                        type="text"
                        placeholder="your name"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </FormControl>
                <Button type="submit" colorScheme="purple" disabled={isUserUpdating}>
                    Change Username
                </Button>
            </form>
        </CustomContainer>
    )
}
