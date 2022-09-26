import { useMoralis } from "react-moralis"
import NotAuthenticated from "../components/NotAuthenticated"
import IsAuthenticated from "../components/IsAuthenticated"


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
