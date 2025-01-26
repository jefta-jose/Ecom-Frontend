import React from "react";
import { twMerge } from "tailwind-merge";

const Container = ({ children, className }) => { // Fix: Properly destructure props
  const newClassName = twMerge(
    "max-w-screen-xl mx-auto py-10 px-4 lg:px-0",
    className
  );
  return <div className={newClassName}>{children}</div>; // Ensure children is rendered
};

export default Container;
