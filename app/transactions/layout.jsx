import Navbar from "@/components/Navbar";
import React from "react";

function layout({ children }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 container px-8 py-8">{children}</main>
    </div>
  );
}

export default layout;
