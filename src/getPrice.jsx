import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import firebaseConfig from "./pages/services/firebase";

export const getPrice = (element) => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    var result = "";

    get(ref(db, `elements/`)).then((snapshot) => {
        if (snapshot.val()[element] !== undefined) {
            result = snapshot.val()[element].generation * (snapshot.val()[element].complexity * 2)
        } else {
            result = "🤮 This element does not exist!"
        }

        return result;
    }).catch((error) => {
        result = error.toString()

        return result;
    });
};