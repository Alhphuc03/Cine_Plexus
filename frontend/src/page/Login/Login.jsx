import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logoweb.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { login, signup } from "../../api/ApiMovie";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // State để chuyển đổi giao diện
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { success, token } = await login(username, password);
      if (success) {
        toast.success("Login successful!");
        console.log("Token:", token);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { success } = await signup(email, username, password);
      if (success) {
        toast.success("Signup successful!");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      {isLoading && (
        <div className="loading-container">
          <div className="loading">Loading...</div>
        </div>
      )}
      <div className="login-form">
        <div className="login-logo-wrapper">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>
        <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <div className="form-switch">
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              <div className="auth-text">
                {isLogin
                  ? "If you don't have an account, sign up!"
                  : "If you don't have an account, Sign In!"}
              </div>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
