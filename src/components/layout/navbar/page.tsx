"use client";
import { useState } from "react";
import InputSearchBox from "./InputSearchBox";
import Image from "next/image";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Stan do zarządzania przyciemnieniem tła wokół inputa

  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-300 bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <Image src="/bartex.png" alt="logo" width={100} height={100} />
            {/* InputSearchBox */}
            <InputSearchBox setIsModalOpen={setIsModalOpen} />
          </div>
        </div>
      </nav>
    </div>
  );
}
