import React from "react"
import "./index.css"
import App from "./App"
import {  AuthProvider } from "./auth";


import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<React.StrictMode>
  <AuthProvider>
     <App />
</AuthProvider>
</React.StrictMode>);
