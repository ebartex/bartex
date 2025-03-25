"use client";
import Navbar from "@/components/layout/navbar/page";
import { useState } from "react";

export default function Home() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* Przekazywanie stanu do Navbar */}
      <Navbar isActive={isActive} setIsActive={setIsActive} />
    </>
  );
}
