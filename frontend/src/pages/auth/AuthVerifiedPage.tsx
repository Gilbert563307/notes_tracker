import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthProvider } from "../../shared/context/AuthProviderConfig";
import { authController } from "../../features/auth/presentation/AuthController";

export default function AuthVerifiedPage() {
  const { login } = useAuthProvider();
  const navigate = useNavigate();

  async function authenticateRequest() {
    const response = await authController.authenticate();
    if (response.authenticated === true && response.auth != null) {
      //   await login(response.auth);
      //   navigate("/kanboards");
    }
  }

  useEffect(() => {
    authenticateRequest();
  }, []);

  return <div>Loading....</div>;
}
