// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRXn2WnFTn4wSu8Dp0Ip2BPYs3oRculAM",
    authDomain: "docagent-4280a.firebaseapp.com",
    projectId: "docagent-4280a",
    storageBucket: "docagent-4280a.firebasestorage.app",
    messagingSenderId: "820100094108",
    appId: "1:820100094108:web:031ce0dc6d3f90a1ec7559",
    measurementId: "G-DJX97DBE9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);

export { app, analytics, auth };
