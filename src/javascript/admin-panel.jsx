import { useEffect } from "react"
import UserContext from "./userContext";
import Error from "./error";

export default function AdminPanel() {
    const { user } = useContext(UserContext);

    if (["AlphaBeta906", "ItzCountryballs"].includes(user)) {
        return (  
            <div>
                <center>
                    <p class="text-2xl">Administrator Panel</p><br /><br />
                </center>

                <center>No features yet, Administrators must add something to the panel.</center>
            </div>
        );
    } else {
        return (
            <Error status="404" />
        )
    }
}
