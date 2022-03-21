import { Link } from "react-router-dom"
import Ads from './ads';

export default function FAQ() {
    return (
        <div>
            <center>
                <p class="text-2xl">FAQ</p><br /><br />
                
                <p class="text-xl">What is this 'Blood Alchemy'?</p>
                Blood Alchemy is a game where you can create elements and combine them to create new ones. Originally this was a Discord bot, but I decided to make it a website instead.<br /><br />

                <p class="text-xl">I heard this game before...</p>
                Yes, this is a game based on another game (Elemental 3) based on Doodle God.<br /><br />

                <p class="text-xl">COPPA?</p>
                Yes, COPPA is enforced in this game. You must be 13 years or older to play.<br /><br />

                <p class="text-xl">I saw a bad word in this site! Please remove it!</p>
                We Blood Alchemy developers are not responsible for any bad words in the game, since this is a community-driven project. I am afraid we can't do anything about it.<br /><br />

                <p class="text-xl">I want to talk to your manager!</p>
                Take a chill pill. Go to the contact page, idiot.<br /><br />
            </center>

        <center><Link to="/about/">Back to About Page</Link><br /></center>
        <center><Link to="/ranks/">Ranks</Link><br /></center>
        <center><Link to="/games/">Games</Link></center>

        <footer>
            <Ads/><br/>
        </footer>
        </div>
    )
}