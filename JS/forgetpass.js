import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  sendSignInLinkToEmail,
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
const auth = getAuth();

const verifyEmail = document.getElementById("verify-email");
const verifyBtn = document.getElementById("verify-btn");

const actionCodeSettings = {
  url: "http://localhost:5500/Login/login.html",

  handleCodeInApp: true,
  iOS: {
    bundleId: "com.example.ios",
  },
  android: {
    packageName: "com.example.android",
    installApp: true,
    minimumVersion: "12",
  },
  // linkDomain: 'custom-domain.com'
};

const verifyUser = () => {
  event.preventDefault();
  sendSignInLinkToEmail(auth, verifyEmail.value, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem("emailForSignIn", verifyEmail.value);
      console.log("Verification Link sent to:", verifyEmail.value);
      verifyEmail.value = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error sending the Link", errorMessage);
    });
};

verifyBtn.addEventListener("click", verifyUser);
