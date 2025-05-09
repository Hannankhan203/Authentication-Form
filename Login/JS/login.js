import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "../../Notes/notes.html";
  }
});

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");

const loginUsers = (event) => {
  event.preventDefault();
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      loginEmail.value = "";
      loginPassword.value = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error logging in!", errorMessage);
      console.log(errorMessage)
    });
};

loginBtn.addEventListener("click", loginUsers);

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  if(isSignInWithEmailLink(auth, window.location.href) && (mode === 'passwordless' || mode === 'signIn')) {
    handlePasswordlessLogin();
    return;
  }
})

async function handlePasswordlessLogin() {
  document.querySelector(".container").style.display = "none";
  document.getElementById("passwordless-login").style.display = "block";

  let email = window.localStorage.getItem("emailForSignIn");

  if(!email) {
    email = window.prompt("Please provide your email for confirmation");
    if(!email) {
      window.location.href = '../login.html';
      return;
    }
  }

  try {
    await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem("emailForSignIn");

    window.history.replaceState({}, document.title, window.location.pathname);

    window.location.replace("../../Notes/notes.html");
  } catch(error) {
    console.error("Password less login fail: ", error.message);
    alert(`Login failed ${error.message}`);
  }
}