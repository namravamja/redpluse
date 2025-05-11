import React from "react";
import Navbar from "../Navbar/page";
import Footer from "../Footer/page";
const HomepageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default HomepageLayout;
