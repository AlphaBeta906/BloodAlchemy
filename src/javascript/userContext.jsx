import { createContext } from "react";

const UserContext = createContext({
    user: "",
    setUser: (username) => {
        // do nothing
    },
});

export default UserContext;