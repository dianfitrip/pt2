import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default function MainLayout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-white">
    
      {!isAuthPage && <Navbar />}
      <main className="flex-1"> 
        {children}
      </main>
      {!isAuthPage && <Footer />}
      
    </div>
  );
}