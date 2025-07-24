"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
const HomeButton = () => {
  return (
    <Link href={"/"}>
      <Button className="cursor-pointer" variant={"secondary"}>
        Back To Home
      </Button>
    </Link>
  );
};

export default HomeButton;
