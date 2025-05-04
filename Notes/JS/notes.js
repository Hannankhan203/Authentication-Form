import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
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

const notesInput = document.getElementById("notes");
const addBtn = document.querySelector(".add-btn");
const notesList = document.querySelector(".notes-list");
const logoutBtn = document.querySelector(".logout-btn");

let notesArray = [];

const fetchAndRenderNotes = async () => {
  const user = auth.currentUser;
  if (!user) return;

  notesArray = [];

  try {
    const q = query(
      collection(db, "notes"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      notesArray.push({ id: docSnap.id, note: data.note });
    });

    renderNotes();
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};

const renderNotes = () => {
  notesList.innerHTML = "";

  notesArray.forEach((noteText, i) => {
    let notes = document.createElement("div");
    notes.classList.add("notes");

    let note = document.createElement("div");
    note.innerHTML = noteText.note;
    notes.appendChild(note);

    let deletBtn = document.createElement("button");
    deletBtn.classList.add("btn");
    deletBtn.innerHTML = "Delete";
    notes.appendChild(deletBtn);
    deletBtn.addEventListener("click", () => deleteNote(i));

    let editBtn = document.createElement("button");
    editBtn.classList.add("btn");
    editBtn.innerHTML = "Edit";
    notes.appendChild(editBtn);
    editBtn.addEventListener("click", () =>
      editNote(i, note, deletBtn, editBtn)
    );

    notesList.appendChild(notes);
  });
};

const addNotes = async () => {
  const noteText = notesInput.value.trim();
  if (noteText === "") {
    notesList.innerHTML = "The input cannot be left empty.";
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "notes"), {
      note: noteText,
      createdAt: new Date(),
      uid: user.uid,
    });
    console.log("Note added.");
    notesInput.value = "";
    fetchAndRenderNotes();
  } catch (error) {
    console.error("Error adding note:", error);
  }
};

async function deleteNote(i) {
  try {
    const noteId = notesArray[i].id;
    await deleteDoc(doc(db, "notes", noteId));
    console.log("Note deleted:", noteId);
    fetchAndRenderNotes();
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

function editNote(i, noteDiv, deletBtn, editBtn) {
  const parentDiv = noteDiv.parentElement;

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = notesArray[i].note;
  inputField.classList.add("edit-note");

  const saveBtn = document.createElement("button");
  saveBtn.innerHTML = "Save";
  saveBtn.classList.add("btn");

  parentDiv.innerHTML = "";
  parentDiv.appendChild(inputField);
  parentDiv.appendChild(saveBtn);

  saveBtn.addEventListener("click", async () => {
    const updatedNote = inputField.value.trim();
    if (updatedNote === "") {
      notesList.innerHTML = "The input field cannot be left empty";
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      const noteId = notesArray[i].id;
      const noteRef = doc(db, "notes", noteId);

      await updateDoc(noteRef, {
        note: updatedNote,
        createdAt: new Date(),
      });
      console.log("Note added.");
      notesInput.value = "";
      fetchAndRenderNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  });
}

const logoutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign out Successfull!", auth);
    })
    .catch((error) => {
      console.log("Error Signing Out!", error);
    });
};

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("../../Login/login.html");
  } else {
    fetchAndRenderNotes();
  }
});

addBtn.addEventListener("click", addNotes);
logoutBtn.addEventListener("click", logoutUser);
