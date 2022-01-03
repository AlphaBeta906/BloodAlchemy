import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import firebaseConfig from "./firebase";

export const getPrice = (element) => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    return get(ref(db, `elements/`)).then((snapshot) => {
        if (snapshot.val()[element] !== undefined) {
            return snapshot.val()[element].generation * (snapshot.val()[element].complexity * 2)
        } else {
            return "🤮 This element does not exist!"
        }
    }).catch((error) => {
        return error.toString()
    });
};