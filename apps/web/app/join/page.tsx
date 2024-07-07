"use client";

import Link from "next/link";
import { useState } from "react";

export default function Join() {
  const [code, setCode] = useState("");

  const validateCode = (code: string) => {
    // regex that replaces all non-numeric characters with empty string
    const regex = /[^\d]/g;
    let formattedCode = code.replace(regex, "");

    // insert a space every 3 digits
    formattedCode =
      formattedCode.length > 3
        ? (formattedCode.match(/.{1,3}/g)?.join(" ") as string)
        : formattedCode;

    setCode(formattedCode);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-2xl w-full px-6 sm:px-8 lg:px-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Join
          </h1>
          <p className="mt-4 text-lg text-foreground">
            Enter your 6-digit code to join.
          </p>
        </div>
        <div className="mt-12">
          <input
            type="text"
            className="mt-1 text-9xl block w-full px-3 py-2 border border-gray-300 text-center rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="123 456"
            maxLength={7}
            accept="numeric"
            value={code}
            onChange={(e) => validateCode(e.target.value)}
          />
        </div>
        <div className="mt-8 w-full flex justify-center">
          <Link
            href={"/game/" + code?.replace(/ /g, "")}
            className="w-full bg-primary text-primary-foreground text-center hover:bg-primary/90 p-2 rounded-xl"
          >
            Join
          </Link>
        </div>
      </div>
    </div>
  );
}
