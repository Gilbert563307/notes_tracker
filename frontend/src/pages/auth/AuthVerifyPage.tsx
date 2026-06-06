import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthProvider } from "../../shared/context/AuthProviderConfig";
import { authController } from "../../features/auth/presentation/AuthController";
import { Authentication } from "../../features/auth/application/response/Authentication";

export default function AuthVerifyPage() {
  const { login } = useAuthProvider();
  const navigate = useNavigate();

  async function authenticateRequest() {
    const response = await authController.authenticate();
    if (response != undefined && response instanceof Authentication) {
      await login(response);
      navigate("/kanboards");
    }
  }

  useEffect(() => {
    authenticateRequest();
  }, []);

  return <div>Loading....</div>;
}
