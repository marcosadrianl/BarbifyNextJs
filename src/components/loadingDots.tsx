"use client";
import { useState, useEffect } from "react";

function LoadingDots() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

export default LoadingDots;
