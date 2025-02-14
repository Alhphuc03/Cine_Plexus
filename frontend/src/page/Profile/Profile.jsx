import { useEffect, useState } from "react";
import {
  movieFavorites,
  getUserDetail,
  watchLists,
  ratingMovies,
} from "../../api/ApiMovie";
import loadingimg from "../../assets/Animation - 1720970751731.gif";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";
import { CiLogout, CiStar, CiViewList, CiCircleInfo } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import profile_icon from "../../assets/profile_img.png";
const Profile = () => {
  const [profileData, setProfileData] = useState([]);
  const [dataWatchList, setDataWatchList] = useState([]);
  const [dataRedted, setDataRated] = useState([]);
  const [dataFavorite, setDataFavorite] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("profile-info");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const responseData = await getUserDetail(token);

        setProfileData(responseData.data);

        const responseDataFavorite = await movieFavorites.getFavorites(
          token,
          "movies"
        );
        const responseDataWL = await watchLists.getWatchLists(token, "movies");

        const responseDataRated = await ratingMovies.getRatings(
          token,
          "movies"
        );

        setDataWatchList(responseDataWL);
        setDataRated(responseDataRated);
        setDataFavorite(responseDataFavorite);
        setIsLoading(false);
        console.log("fvdata", responseDataFavorite);
        console.log("fv", dataFavorite);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("accountID");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "profile-info":
        return (
          <div>
            {" "}
            <h1 className="list-title">Profile info</h1>
            <div className="account-info">
              <div className="avatar-profile">
                <img
                  src={profileData.avatarc || profile_icon}
                  alt="Avatar"
                  className="avatar-image"
                />
              </div>
              <div className="profile-details">
                <p>Username: {profileData.username}</p>
                {/* <p>ID: {profileData.id}</p>
                <p>Language: {profileData.iso_639_1}</p>
                <p>Country: {profileData.iso_3166_1}</p> */}
              </div>
            </div>
          </div>
        );
      case "watch-list":
        return (
          <div>
            {dataWatchList.length === 0 ? (
              <p>No movies in watch list.</p>
            ) : (
              <div>
                <h1 className="list-title">Watch list movie</h1>
                <div className="movie-list">
                  {dataWatchList.map((movie) => (
                    <div key={movie.id} className="item-movie">
                      <img
                        src={movie.movieImg}
                        alt={movie.movieImg}
                        className="movie-poster-item"
                      />
                      <p>{movie.movieName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "favorite":
        return (
          <div>
            {dataFavorite.length === 0 ? (
              <p>No movies in watch list.</p>
            ) : (
              <div>
                <h1 className="list-title">Favorite movie</h1>
                <div className="movie-list">
                  {dataFavorite.map((movie) => (
                    <div key={movie.id} className="item-movie">
                      <img
                        src={movie.movieImg}
                        alt={movie.movieImg}
                        className="movie-poster-item"
                      />
                      <p>{movie.movieName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "rating":
        return (
          <div>
            {dataRedted.length === 0 ? (
              <p>No movies in watch list.</p>
            ) : (
              <div>
                <h1 className="list-title">Rated movie</h1>
                <div className="movie-list">
                  {dataRedted.map((movie) => (
                    <div key={movie.id} className="item-movie">
                      <img
                        src={movie.movieImg}
                        alt={movie.movieImg}
                        className="movie-poster-item"
                      />
                      <p>{movie.movieName}</p>
                      <div className="rate">
                        <FaStar style={{ color: "yellow" }} />
                        <p>{movie.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "logout":
        handleLogout();
        return <div>You have been logged out</div>;
      default:
        return <div>Select an option</div>;
    }
  };
  return (
    <div className="flex">
      <Navbar />
      {isLoading ? (
        <div className="loading-container">
          <img src={loadingimg} alt="Loading..." className="loading-gif" />
        </div>
      ) : (
        <div className="profile-container">
          <div className="profile-option">
            <div className="option-list">
              <div
                className={`profile-info ${
                  selectedOption === "profile-info" ? "active" : ""
                }`}
                onClick={() => setSelectedOption("profile-info")}
              >
                <CiCircleInfo />
                <h3>Profile Info</h3>
              </div>
              <div
                className={`watch-list ${
                  selectedOption === "watch-list" ? "active" : ""
                }`}
                onClick={() => setSelectedOption("watch-list")}
              >
                <CiViewList />
                <h3>Watch list</h3>
              </div>
              <div
                className={`favorite ${
                  selectedOption === "favorite" ? "active" : ""
                }`}
                onClick={() => setSelectedOption("favorite")}
              >
                <MdFavoriteBorder />
                <h3>Favorite list</h3>
              </div>
              <div
                className={`rating-option ${
                  selectedOption === "rating" ? "active" : ""
                }`}
                onClick={() => setSelectedOption("rating")}
              >
                <CiStar />
                <h3>Rating list</h3>
              </div>
              <div
                className={`logout ${
                  selectedOption === "logout" ? "active" : ""
                }`}
                onClick={() => setSelectedOption("logout")}
              >
                <CiLogout />
                <h3>Log out</h3>
              </div>
            </div>
          </div>
          <div className="profile-content">{renderContent()}</div>
        </div>
      )}
    </div>
  );
};
export default Profile;
