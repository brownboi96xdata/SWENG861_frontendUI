// Create this file inside frontend/
import React from "react";
import InputForm from "./components/InputForm";
import SocialLogin from "./components/SocialLogin";

const App = () => {
  return (
    <div>
      <h1>Game Store</h1>
      <SocialLogin />
      <InputForm />
    </div>
  );
};