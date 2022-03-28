import React from "react";
import { NextPage } from "next";
import Header from "../components/Header";

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div>
      <title>Page kan maaha mid jira</title>
        <Header />
        <div className="flex justify-between p-5 max-w-7xl mx-auto">
            <h1>The page is : {statusCode} go back to home please</h1>
        </div>
      
    </div>
  );
};

Error.getInitialProps = ({ res }) => {
  const statusCode = res?.statusCode || 500;

  return { statusCode };
};

export default Error;