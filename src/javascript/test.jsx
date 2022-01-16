import { useEffect } from "react"
import UserContext from "./userContext";
import { useContext } from "react";
if (["AlphaBeta906", "ItzCountryballs"].includes(user)) {
export default function Test() {
    const { user } = useContext(UserContext);
    useEffect(() => {        
        const pushAd = () => {
            try {
                const adsbygoogle = window.adsbygoogle
                console.log({ adsbygoogle })
                adsbygoogle.push({})
            } catch (e) {
                console.error(e.toString())
            }
        }

        let interval = setInterval(() => {
            // Check if Adsense script is loaded every 300ms
            if (window.adsbygoogle) {
                pushAd()
                // clear the interval once the ad is pushed so that function isn't called indefinitely
                clearInterval(interval)
            }
        }, 300)

        return () => {
            clearInterval(interval)
        }
    }, []);

    return (
        <ins className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client='ca-pub-8343050917784042'
        data-ad-slot='4420988986'
        data-ad-format='auto' />
    );
 }
} else {
    return (
        <Error status="403" />
    )
}