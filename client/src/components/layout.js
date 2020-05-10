import React, { Children } from "react";
import logo from "../logo.svg";
import { Navbar } from "../components/navbar";

export const Layout = ({ title, children }) => (
  <div>
    <Navbar />
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          {title}
        </h1>
      </div>
    </header>
    <main>{children}</main>
  </div>
);
