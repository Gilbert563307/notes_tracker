import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router";
import { authController } from "../../features/auth/presentation/AuthController";
import { AuthenticateRequest } from "../../features/auth/application/request/AuthenticateRequest";
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
    if (response.authenticated === true && response.auth != null) {
      await login(response.auth);
      navigate("/kanboards");
    }
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT SIDE - FORM */}
        <div className=" d-flex align-items-center justify-content-center bg-white p-5">
          <div className="w-25">
            <h2 className="mb-4 fw-semibold">Your Tasks's</h2>

            <form onSubmit={handleSubmit}>
              {/* Email */}
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

              {/* Password */}
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

              {/* Signup Button */}
              <button className="btn btn-success w-100 py-2 mb-3">Login</button>

              {/* Divider */}
              <div className="text-center my-3 text-muted">or</div>

              <p className="text-center mt-3">
                Don't have an account?{" "}
                <Link to="/auth/register" className="btn btn-link">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    // <article className="auth-article">
    //   <article className="auth-vector">
    //     <div className="auth-content">
    //       <h1 className="mb-4">Your Tasks</h1>

    //       {/* Login Form */}
    //       <form className="" onSubmit={handleSubmit}>
    //         {/* Email Field */}
    //         <div className="mb-3">
    //           <label className="form-label">Email address</label>
    //           <input
    // type="email"
    // name="email"
    // value={form.email}
    // onChange={handleChange}
    // className="form-control"
    // placeholder="Enter your email"
    //           />
    //         </div>

    //         {/* Password Field */}
    //         <div className="mb-3">
    //           <label className="form-label">Password</label>
    //           <input
    // type="password"
    // name="password"
    // value={form.password}
    // onChange={handleChange}
    // className="form-control"
    // placeholder="Enter your password"
    //           />
    //         </div>

    //         {/* Login Button */}
    //         <button type="submit" className="btn btn-primary w-100 mb-3">
    //           Sign In
    //         </button>

    //         {/* Register Button */}
    //         <Link to="/auth/register" className="btn btn-link">
    //           Register
    //         </Link>
    //       </form>
    //     </div>
    //   </article>
    // </article>
  );
}
