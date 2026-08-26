import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HomeExperience from "../components/home/HomeExperience";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const element = document.getElementById(location.hash.replace("#", ""));
    if (!element) return;

    window.setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [location]);

  return null;
}

export default function HomePage() {
  return (
    <>
      <ScrollToHash />
      <HomeExperience />
    </>
  );
}
