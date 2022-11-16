import React from "react";
import { NavBarComponent } from "../NavBarComponent";

const Layout = ({ children }) => {
  return (
    <>
      <NavBarComponent />
      <main className="mt- flex flex-col justify-between items-center h-screen">
        {children}
      </main>
    </>
  );
};

export default Layout;
