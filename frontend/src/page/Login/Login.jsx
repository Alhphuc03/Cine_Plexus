import axios from "axios";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logoweb.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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
      // Gửi yêu cầu đăng nhập đến backend
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      // Kiểm tra xem phản hồi có chứa token không
      if (response.data.token) {
        // Lưu token vào localStorage
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful!");

        // Chuyển hướng về trang chủ
        navigate("/");
      } else {
        // Nếu không có token, hiển thị thông báo lỗi
        toast.error(response.data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Kiểm tra xem lỗi có thông báo từ server không
      const errorMsg =
        error.response?.data?.msg || "An error occurred during login.";
      toast.error(errorMsg);
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
