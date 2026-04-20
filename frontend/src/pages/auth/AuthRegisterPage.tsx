import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authController } from "../../features/auth/presentation/AuthController";
import { RegisterRequest } from "../../features/auth/application/request/RegisterRequest";

export default function AuthRegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    displayName: "",
    emailAddress: "",
    password: "",
    passwordConfirm: "",
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
    const response = await authController.register(
      new RegisterRequest(form.displayName, form.emailAddress, form.password, form.passwordConfirm),
    );
    if (response.created) {
      navigate("/auth/verify");
    }
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT SIDE - FORM */}
        <div className=" d-flex align-items-center justify-content-center bg-white p-5">
          <div className="w-25">
            <h2 className="mb-4 fw-semibold">Get Started Now</h2>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="displayName"
                  className="form-control"
                  placeholder="Enter your name"
                  value={form.displayName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  name="emailAddress"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.emailAddress}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {/* Password Confirm*/}
              <div className="mb-3">
                <label className="form-label">Password Confirm</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  className="form-control"
                  placeholder="Enter password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                />
              </div>

              {/* Signup Button */}
              <button className="btn btn-success w-100 py-2 mb-3">Signup</button>

              {/* Divider */}
              <div className="text-center my-3 text-muted">or</div>

              {/* Social Buttons */}
              {/* <div className="d-flex gap-2 mb-3">
                <button type="button" className="btn btn-outline-dark w-100">
                  Google
                </button>
                <button type="button" className="btn btn-outline-dark w-100">
                  Apple
                </button>
              </div> */}

              {/* Login link */}
              <p className="text-center mt-3">
                Have an account?{" "}
                <Link to="/auth/verify" className="text-primary text-decoration-none">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
