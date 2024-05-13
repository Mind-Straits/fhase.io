import Image from "next/image";
import Navbar from "./components/Navbar";
import { Banner } from "./components/Banner";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import AboutUs from "./components/aboutus";
import Advice from "./components/Advice";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Banner />
      <AboutUs />
      <Advice />
      <Hero />
      <Footer />
    </main>
  );
}
