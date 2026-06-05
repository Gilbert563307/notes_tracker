import React from "react";
import "./auth.css";
import { Link } from "react-router";
import { authController } from "../../features/auth/presentation/AuthController";
import IMAGES from "../../assets/images/Images";

export default function AuthVerifyPage() {
  //  const response = await authController.authenticate(new AuthenticateRequest(form.email, form.password));

  function signInWithGoogle() {
    authController.signInWithGoogle();
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* LEFT SIDE - FORM */}
        <div className=" d-flex align-items-center justify-content-center bg-white p-5">
          <div className="w-25">
            <h2 className="mb-4 fw-semibold">Your Tasks's</h2>

            <div className="sign-in-buttons">
              {/* Signup Button */}
        

              <button type="button" className="btn sign-in-btn google-button" onClick={signInWithGoogle}>
                <img src={IMAGES.googleIcon} className="sign-in-icons" alt="goole icon"></img>
                Sign in with Google
              </button>

              {/* Divider */}
              <div className="text-center my-3 text-muted">or</div>

              <p className="text-center mt-3">
                Don't have an account?{" "}
                <Link to="/auth/policy" className="btn btn-link">
                  Our policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
