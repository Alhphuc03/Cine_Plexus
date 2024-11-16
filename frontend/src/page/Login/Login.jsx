import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logoweb.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/ApiMovie";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API login
      const result = await login(username, password);

      if (result.success) {
        toast.success("Login successful!");
        // Chuyển hướng về trang chủ
        navigate("/");
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
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
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
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
            Login
          </button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <div className="form-switch">
              <span>Switch to Signup</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
