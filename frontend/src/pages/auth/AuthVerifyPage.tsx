import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router";
import { authController } from "../../features/auth/presentation/AuthController";
import { AuthenticateRequest } from "../../features/auth/presentation/request/AuthenticateRequest";
import { useAuthProvider } from "../../shared/context/AuthProviderConfig";

type FormType = {
  email: string;
  password: string;
};

export default function AuthVerifyPage() {
  const navigate = useNavigate();
  const { login } = useAuthProvider();

  const [form, setForm] = useState<FormType>({
    email: "",
    password: "",
  });

  function handleChange(e: Event) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const response = await authController.authenticate(new AuthenticateRequest(form.email, form.password));
    if (response.authenticated && response.auth) {
      await login(response.auth);
      navigate("/kanboards");
    }
  }

  return (
    <article className="auth-article">
      <article className="auth-vector">
        <div className="auth-content">
          <h1 className="mb-4">Your Tasks</h1>

          {/* Login Form */}
          <form className="" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Sign In
            </button>

            {/* Register Button */}
            <Link to="/auth/register" className="btn btn-link">
              Register
            </Link>
          </form>
        </div>
      </article>
    </article>
  );
}
