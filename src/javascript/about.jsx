import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <center>
        <p class="text-2xl">About</p><br /><br />
      </center>

      <center><p class="text-xl">Who are we?</p></center>
      This question deserves to be placed here instead of the FAQ page. So... yeah <i>who</i> are we?<br /><br />

      <div class="flex flex-col">
        <div class="container mx-auto px-4 py-4 border-2 border-cyan-700 hover:border-cyan-300 rounded-lg w-48">
          <img src="https://i.ibb.co/3sxrcXF/63622656.jpg" alt="63622656" border="0" class="w-24 h-auto mx-auto rounded-full hover:-rotate-6 transition-all ease-in-out" /><br />
          <center>
            <b>AlphaBeta906</b>
            <p class="text-sm text-blue-700">Lead Developer & Director</p>
          </center>
        </div><br />
        <div class="container mx-auto px-4 py-4 border-2 border-cyan-700 hover:border-cyan-300 rounded-lg w-48">
          <img src="https://i.ibb.co/dB52PHx/channels4-profile.jpg" alt="63622656" border="0" class="w-24 h-auto mx-auto rounded-full hover:-rotate-6 transition-all ease-in-out" /><br />
          <center>
            <b>ItzCountryballs</b>
            <p class="text-sm text-blue-700">Intern Developer</p>
          </center>
        </div>
      </div>
      <br/>

      <center><Link to="/faq/">FAQ</Link><br /></center>
      <center><Link to="/ranks/">Ranks</Link><br /></center>
      <center><Link to="/games/">Games</Link></center>
    </div>
  );
}