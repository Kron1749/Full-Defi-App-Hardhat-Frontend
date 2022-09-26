import { ChakraProvider } from "@chakra-ui/react"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <MoralisProvider
                appId={process.env.NEXT_PUBLIC_APPID}
                serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
            >
                <NotificationProvider>
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </ChakraProvider>
    )
}

export default MyApp
