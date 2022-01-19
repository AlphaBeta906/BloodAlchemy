import { Link } from "react-router-dom";

export default function Ranks() {
  return (
    <div>
      <center>
        <p class="text-2xl">Ranks of Blood Alchemy</p><br /><br />
      </center>

      <center><span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">⚙️ Administrator</span></center>
      <center>The administrator rank is for Blood Alchemy developers and staff. Any users with this rank would manage the site, answer what problem you are having right now, and fix bugs.</center>
      <center>Obtainable by: Being a staff or developer at Blood Alchemy.</center><br /><br />

      <center><span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">🧪 Trusted BETA Tester</span></center>
      <center>The trusted BETA tester rank is for BETA testers which Blood Alchemy developers deem trustworthy. Any users with this rank would test new BETA features that hasn't been released to the public yet.</center>
      <center>Obtainable by: When a staff of Blood Alchemy deems you trustworthy of testing new features.</center><br /><br />

      <center><Link to="/about/">Back to About Page</Link><br /></center>
      <center><Link to="/faq/">FAQ</Link><br /></center>
    </div>
  );
}