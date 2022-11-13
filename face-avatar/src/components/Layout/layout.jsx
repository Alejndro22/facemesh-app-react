import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <main className="flex flex-col justify-between items-center h-screen">
        {children}
      </main>
    </>
  );
};

export default Layout;
