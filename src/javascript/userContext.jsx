import { createContext } from "react";

const UserContext = createContext({
    user: "",
    setUser: (username) => {},
});

export default UserContext;