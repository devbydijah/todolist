"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="p-4 text-center h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-4xl text-red-500">404 - Page Not Found</h1>
        <p className="text-lg">The page you are looking for does not exist.</p>
        <div className="flex gap-4">
          <Button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          >
            <AiOutlineArrowLeft /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
