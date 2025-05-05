import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfK0MRnqJJNuzKJsAxLmvcG-QAbjO5Y3g",
  authDomain: "notes-app-authentication-a9a09.firebaseapp.com",
  projectId: "notes-app-authentication-a9a09",
  storageBucket: "notes-app-authentication-a9a09.firebasestorage.app",
  messagingSenderId: "446426307273",
  appId: "1:446426307273:web:8b13e05419b8e6e4cb8b18",
  measurementId: "G-92EVTJVRQD",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "../Notes/notes.html";
  }
});

const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const signUpEmail = document.getElementById("email");
const signUpPassword = document.getElementById("password");
const signUpBtn = document.getElementById("sign-up-btn");

const signUpUsers = async (event) => {
  event.preventDefault();

  if (
    firstName.value === "" ||
  lastName.value === "" ||
  signUpEmail.value === "" ||
  signUpPassword.value === ""
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", signUpEmail.value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("User with this email already exists in the database.");
      alert("User with this email already exists in the database.");
    } else {
      const docRef = await addDoc(usersRef, {
        firstName: firstName.value,
        lastName: lastName.value,
        email: signUpEmail.value,
        password: signUpPassword.value,
      });
      console.log("User saved in Firestore with ID:", docRef.id);
    }

    createUserWithEmailAndPassword(
      auth,
      signUpEmail.value,
      signUpPassword.value
    )
      .then((userCredential) => {
        console.log("User Sign Up Successful:", userCredential.user);
        firstName.value = "";
        lastName.value = "";
        signUpEmail.value = "";
        signUpPassword.value = "";
      })
      .catch((error) => {
        console.log("Sign Up Failed:", error.message);
        alert("Sign Up Failed:", error);
      });
  } catch (e) {
    console.error("Error during signup:", e);
    alert("Error during signup:", e);
  }
};

signUpBtn.addEventListener("click", signUpUsers);
