import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCv1uxTpLa6jk1DLJcbFJCEuwoseO8JJMc",
    authDomain: "rikoweb-ff259.firebaseapp.com",
    databaseURL: "https://rikoweb-ff259-default-rtdb.firebaseio.com",
    projectId: "rikoweb-ff259",
    storageBucket: "rikoweb-ff259.appspot.com",
    messagingSenderId: "15088740264",
    appId: "1:15088740264:web:3383a1309798bbf2d35f9d",
    measurementId: "G-BFRJ1NBC54"
  }

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
