import React from "react";

import "./index.css";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <>
      <div className="main-content">{children}</div>
    </>
  );
};

export default PageLayout;