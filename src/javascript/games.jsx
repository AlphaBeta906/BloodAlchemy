import { Link } from 'react-router-dom';

export default function Games() {
    return (
        <div>
            <center>
                <p class="text-2xl">Games</p>
            </center><br />

            <center>
                <p class="text-xl">War and Civilization</p>
            </center><br />
            <p>War and Civilization is a terminal civilization game, which is based on games such as Sid Mier's Civilization.</p>

            <br /><br />

            <center><Link to="/about/">Back to About Page</Link><br /></center>
            <center><Link to="/faq/">FAQ</Link><br /></center>
            <center><Link to="/ranks/">Ranks</Link></center>

            <footer>
                <Ads/><br/>
            </footer>
        </div>
    );
}