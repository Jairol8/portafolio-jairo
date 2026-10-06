import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Education from "./components/Education/Education";
import Areas from "./components/Areas/Areas";
import Projects from "./components/Projects/Projects";
import Experience from "./components/Experience/Experience";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

import ProjectCase from "./pages/ProjectCase/ProjectCase";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Admin from "./pages/Admin/Admin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import "./App.css";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Education />
        <Areas />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* PORTAFOLIO PÚBLICO */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* CASOS DE ESTUDIO */}
      <Route
        path="/proyectos/:projectId"
        element={<ProjectCase />}
      />

      {/* LOGIN */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* ADMINISTRACIÓN PROTEGIDA */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin"
          element={<Admin />}
        />
      </Route>
    </Routes>
  );
}

export default App;