import React from "react";
import "./auth.css";
import { Link } from "react-router";

export default function AuthVerifyPage() {
  return (
    <article className="auth-article">
      <article className="auth-vector">
        <div className="auth-content">

          <h1 className="mb-4">Your Tasks</h1>

          {/* Login Form */}
          <form className="w-100" style={{ maxWidth: "400px" }}>
            
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              
            >
              Sign In
            </button>

            {/* Register Button */}
            <Link
              to="/auth/register"
              className="btn btn-link"
            >
              Register
            </Link>

          </form>

        </div>
      </article>
    </article>
  );
}