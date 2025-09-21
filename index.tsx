
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcB-kL6pLAHSiM1TtM1geYlcZKSXJPdM0",
  authDomain: "tos-generator-915af.firebaseapp.com",
  projectId: "tos-generator-915af",
  storageBucket: "tos-generator-915af.firebasestorage.app",
  messagingSenderId: "1041442122031",
  appId: "1:1041442122031:web:7c7589aab621f069a9d9da",
  measurementId: "G-BS7NJYFMQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
