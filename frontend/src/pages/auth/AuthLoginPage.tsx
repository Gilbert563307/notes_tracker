import "./auth.css";
import { Link } from "react-router";
import { authController } from "../../features/auth/presentation/AuthController";
import IMAGES from "../../assets/images/Images";

export default function AuthLoginPage() {
  //  const response = await authController.authenticate(new AuthenticateRequest(form.email, form.password));

  function signInWithGoogle() {
    authController.signInWithGoogle();
  }

  return (
    <article className="auth-article ">
      <article className="auth-vector">
        <div className="auth-content">
          {/* LEFT SIDE - FORM */}
          <div className="auth-content-section">
            <div >
              <h2 className="mb-4 fw-semibold">Your Tasks's</h2>

              <div className="sign-in-buttons">
                {/* Signup Button */}

                <button type="button" className="btn sign-in-btn google-button" onClick={signInWithGoogle}>
                  <img src={IMAGES.googleIcon} className="sign-in-icons" alt="goole icon"></img>
                  Sign in with Google
                </button>

                <p className="text-center mt-3">
                  <Link to="/auth/policy" className="btn btn-link">
                    Our Sign In policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </article>
  );
}
