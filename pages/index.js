import { useMoralis } from "react-moralis"
import NotAuthenticated from "../components/AuthPages/NotAuthenticated"
import IsAuthenticated from "../components/AuthPages/IsAuthenticated"


export default function Home() {
    const { isAuthenticated} = useMoralis()
    console.log(isAuthenticated)
    if (!isAuthenticated) {
        return (
            <NotAuthenticated/>
        )
    } 
        return (
        
            <IsAuthenticated />
        )
    
}
