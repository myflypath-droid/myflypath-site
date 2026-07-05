import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import CGU from "@/pages/CGU";
import CGV from "@/pages/CGV";
import Confidentialite from "@/pages/Confidentialite";
import ClubPage from "@/pages/ClubPage";
import ClubSuccess from "@/pages/ClubSuccess";
import AdminDashboard from "@/pages/AdminDashboard";
import QuizPPL from "@/pages/QuizPPL";
import ClubsLanding from "@/pages/ClubsLanding";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/tester-mon-niveau" element={<QuizPPL />} />
        <Route path="/clubs" element={<ClubsLanding />} />
        <Route path="/club/:slug" element={<ClubPage />} />
        <Route path="/club/:slug/success" element={<ClubSuccess />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}