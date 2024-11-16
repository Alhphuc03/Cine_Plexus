import "./Navbar.css";
import bell_icon from "../../assets/bell_icon.svg";
import caret_icon from "../../assets/caret_icon.svg";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoWeb from "../../assets/logoweb.png";
import profile_icon from "../../assets/profile_img.png";
import Search from "../Search/Search";
import search_icon from "../../assets/search_icon.svg";
import API from "../../api/UserAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [profileImage, setProfileImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navRef = useRef();
  const { pathname } = useLocation();
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add("nav-dark");
      } else {
        navRef.current.classList.remove("nav-dark");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await API.getUserDetails();
        if (userDetails.avatar) {
          setProfileImage(userDetails.avatar);
        } else {
          setProfileImage(profile_icon);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successful!");
    navigate("/login");
  };

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logoWeb} alt="" />
        </Link>
        <ul>
          <li>
            <Link to="/" className={pathname === "/" ? "active" : ""}>
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/tvShow"
              className={pathname === "/tvShow" ? "active" : ""}
            >
              TV SHOW
            </Link>
          </li>
          <li>
            <Link
              to="/movies"
              className={pathname === "/movies" ? "active" : ""}
            >
              MOVIES
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={bell_icon} alt="" className="icons" />
        <img
          src={search_icon}
          alt="Search"
          className="icons"
          onClick={() => setSearchVisible(!searchVisible)}
        />
        <div className="navbar-profile">
          <Link to={profileImage ? "/profile" : "/login"}>
            <img
              src={profileImage || profile_icon}
              alt="Profile"
              className="profile"
            />
          </Link>
          <img
            src={caret_icon}
            alt=""
            onClick={() => setShowDropdown(!showDropdown)}
            className="caret-icon"
          />
          {showDropdown && (
            <div className="dropdown">
              <button>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
      {searchVisible && <Search onClose={() => setSearchVisible(false)} />}
    </div>
  );
};

export default Navbar;
