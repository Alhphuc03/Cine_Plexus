import { useEffect, useState } from "react";
import loadingimg from "../../../assets/Animation - 1720970751731.gif";
import Navbar from "../../../components/Navbar/Navbar";
import icon_play from "../../../assets/icon-play.png";
import "./MovieDetail.css";
import { Link, useParams } from "react-router-dom";
import tmdbApi from "../../../api/api";
import {
  movieFavorites,
  watchLists,
  getMovieM3u8Link,
} from "../../../api/ApiMovie";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { MdBookmarkAdd } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { BiCategory } from "react-icons/bi";
import { GiWorld } from "react-icons/gi";
import ReviewItem from "../../../components/ReviewsList/ReviewList";
import { IoMdTime } from "react-icons/io";
import Similar from "../../../components/Similar/Similar";
import Credits from "../../../components/Credits/Credits";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MovieDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [movieDetail, setMovieDetail] = useState({});
  const [reviewMovieDetail, setReviewMovieDetail] = useState([]);
  const { id } = useParams();
  const [currentReviewsIndex, setCurrentReviewsIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchList, setIsWatchList] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
  const [m3u8Link, setM3u8Link] = useState("");
  const [playNow, setPlayNow] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
      if (window.innerWidth < 500) {
        setReviewsPerPage(1);
      } else if (window.innerWidth < 800) {
        setReviewsPerPage(2);
      } else {
        setReviewsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await tmdbApi.getMovieDetails(id);
        const responseReview = await tmdbApi.getReviewDetails("movie", id);
        setMovieDetail(response);
        setReviewMovieDetail(responseReview.results);

        // Call the movieFavorites.getFavorites function
        const favoriteResponse = await movieFavorites.getFavorites(token);
        const isMovieFavorite = favoriteResponse.some(
          (movie) => movie.movieId === id
        );
        setIsFavorite(isMovieFavorite);

        const watchListResponse = await watchLists.getWatchLists(token);
        const isMovieWatchList = watchListResponse.some(
          (movie) => movie.movieId === id
        );
        setIsWatchList(isMovieWatchList);

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const page = Math.ceil((currentReviewsIndex + 1) / reviewsPerPage);
    setCurrentPage(page);
  }, [currentReviewsIndex, reviewsPerPage]);

  const handleNextReviews = () => {
    setCurrentReviewsIndex((prevIndex) => prevIndex + reviewsPerPage);
  };

  const handlePrevReviews = () => {
    setCurrentReviewsIndex((prevIndex) => prevIndex - reviewsPerPage);
  };

  const totalPages = Math.ceil(reviewMovieDetail.length / reviewsPerPage);

  const renderPageIndicators = () => {
    const pageIndicators = [];
    const totalIndicators = Math.min(totalPages, 4);
    for (let i = 1; i <= totalIndicators; i++) {
      const isActive = i === currentPage ? "active" : "";
      pageIndicators.push(
        <div
          key={i}
          className={`page-indicator ${isActive}`}
          onClick={() => setCurrentReviewsIndex((i - 1) * reviewsPerPage)}
        ></div>
      );
    }

    if (totalPages > 4) {
      pageIndicators.splice(2, 0, <span key="dots">...</span>);
    }

    return pageIndicators;
  };

  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to log in to manage favorites.");
      return;
    }

    // Hàm xử lý thêm/xoá yêu thích chung
    const handleFavoriteAction = async (action, movieId, userToken) => {
      try {
        const response = await action(movieId, userToken);

        if (response) {
          return true; // Trả về thành công
        } else {
          throw new Error("Action failed.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while updating favorites.");
        return false;
      }
    };

    const action = isFavorite
      ? movieFavorites.deleteFavorite
      : movieFavorites.addFavorite;
    const success = await handleFavoriteAction(action, id, token);

    if (success) {
      setIsFavorite(!isFavorite); // Cập nhật trạng thái yêu thích
      toast.success(
        isFavorite ? "Removed from favorites!" : "Added to favorites!"
      );
    } else {
      toast.error(
        isFavorite
          ? "Failed to remove from favorites."
          : "Failed to add to favorites."
      );
    }
  };

  const handleWatchListClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to log in to manage watch list.");
      return;
    }

    // Hàm xử lý thêm/xoá watch list chung
    const handleWatchListAction = async (action, movieId, userToken) => {
      try {
        const response = await action(movieId, userToken);

        if (response) {
          return true; // Trả về thành công
        } else {
          throw new Error("Action failed.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while updating the watch list.");
        return false;
      }
    };

    const action = isWatchList
      ? watchLists.deleteWatchList
      : watchLists.addWatchList;
    const success = await handleWatchListAction(action, id, token);

    if (success) {
      setIsWatchList(!isWatchList); // Cập nhật trạng thái watchlist
      toast.success(
        isWatchList ? "Removed from watch list!" : "Added to watch list!"
      );
    } else {
      toast.error(
        isWatchList
          ? "Failed to remove from the watch list."
          : "Failed to add to the watch list."
      );
    }
  };

  const handleRatingClick = () => {
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async () => {
    try {
      await tmdbApi.addRating("movie", id, ratingValue);
      setIsRating((prev) => !prev);
      setIsRatingModalOpen(false);
      toast.success("Rating submitted successfully!");
    } catch (error) {
      console.error("Error adding rating:", error);
      toast.error("Failed to submit rating.");
    }
  };

  const handlePlayNow = async (title) => {
    try {
      const link = await getMovieM3u8Link(title);
      setM3u8Link(link);
      setPlayNow(!playNow);
    } catch (err) {
      console.error("Error: ", err.message);
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <ToastContainer />
      {isLoading ? (
        <div className="loading-container">
          <img src={loadingimg} alt="Loading..." className="loading-gif" />
        </div>
      ) : (
        <div className="movie-detail">
          {playNow ? (
            <>
              <div className="movie-poster">
                <ReactPlayer
                  url={m3u8Link}
                  playing={true}
                  controls={true}
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="movie-play">
                <div className="movie-title-movie-play">
                  <h2>{movieDetail.title}</h2>
                  <span>{movieDetail.tagline}</span>
                </div>
                <div className="icon-action-list-movie-play">
                  <div
                    className="icon-action-movie-play"
                    onClick={handleFavoriteClick}
                  >
                    <FaHeartCirclePlus
                      style={{ color: isFavorite ? "red" : "gray" }}
                    />
                  </div>
                  <div
                    className="icon-action-movie-play"
                    onClick={handleWatchListClick}
                  >
                    <MdBookmarkAdd
                      style={{ color: isWatchList ? "red" : "gray" }}
                    />
                  </div>
                  <div
                    className="icon-action-movie-play"
                    onClick={handleRatingClick}
                  >
                    <FaStar style={{ color: isRating ? "yellow" : "gray" }} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="movie-poster">
              <img
                src={
                  "https://image.tmdb.org/t/p/original/" +
                  (isMobile
                    ? movieDetail.poster_path
                    : movieDetail.backdrop_path)
                }
                alt="movie-backdrop"
                className="movie-backdrop"
              />
              <Link to={`/player/movie/${movieDetail.id}`} key={movieDetail.id}>
                <img src={icon_play} className="icon-play" alt="" />
              </Link>
              <div className="movie-title">
                <h2>{movieDetail.title}</h2>
                <span>{movieDetail.tagline}</span>
              </div>
              <div className="movie-action">
                <button
                  className="btn-play-movie"
                  onClick={() => handlePlayNow(movieDetail.original_title)}
                >
                  <FaPlay className="icon-play-movie" />
                  Play Now
                </button>
                <div className="icon-action-list">
                  <div className="icon-action" onClick={handleFavoriteClick}>
                    <FaHeartCirclePlus
                      style={{ color: isFavorite ? "red" : "gray" }}
                    />
                  </div>
                  <div className="icon-action" onClick={handleWatchListClick}>
                    <MdBookmarkAdd
                      style={{ color: isWatchList ? "red" : "gray" }}
                    />
                  </div>
                  <div className="icon-action" onClick={handleRatingClick}>
                    <FaStar style={{ color: isRating ? "yellow" : "gray" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="movie-details-container">
            <div className="movie-details-left">
              <div className="overview">
                <h3>Overview</h3>
                <span className="description">{movieDetail.overview}</span>
              </div>
              <div className="reviews">
                <h3>Reviews</h3>
                <div className="review-lists">
                  {reviewMovieDetail
                    .slice(
                      currentReviewsIndex,
                      currentReviewsIndex + reviewsPerPage
                    )
                    .map((result, index) => (
                      <ReviewItem
                        key={index}
                        author={result.author}
                        content={result.content}
                        avatarPath={result.author_details.avatar_path}
                        rating={result.author_details.rating}
                      />
                    ))}
                </div>
                <div className="review-navigation">
                  <button
                    onClick={handlePrevReviews}
                    disabled={currentReviewsIndex === 0}
                  >
                    <GrLinkPrevious />
                  </button>
                  <div className="page-indicators">
                    {renderPageIndicators()}
                  </div>
                  <button
                    onClick={handleNextReviews}
                    disabled={
                      currentReviewsIndex + reviewsPerPage >=
                      reviewMovieDetail.length
                    }
                  >
                    <GrLinkNext />
                  </button>
                </div>
              </div>
            </div>
            <div className="movie-details-right">
              <div className="movie-runtime">
                <h3>
                  <IoMdTime />
                  Time
                </h3>
                <span>{movieDetail.runtime} Mins</span>
              </div>
              <div className="movie-release">
                <h3>
                  <FaRegCalendarAlt />
                  Release Date
                </h3>
                <span>{movieDetail.release_date}</span>
              </div>
              <div className="movie-genre">
                <h3>
                  <BiCategory />
                  Genres
                </h3>
                {movieDetail.genres.map((genre, index) => (
                  <button className="btn-genre" key={index}>
                    {genre.name}
                  </button>
                ))}
              </div>
              <div className="movie-country">
                <h3>
                  <GiWorld />
                  Nations
                </h3>
                {movieDetail.production_countries.map((country, index) => (
                  <button className="btn-country" key={index}>
                    {country.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="movie-credits">
            <h3>Credits</h3>
            <Credits cate="movie" id={movieDetail.id} />
          </div>
          <div className="movie-similar">
            <h3>Similar Movies</h3>
            <Similar cate="movie" id={movieDetail.id} />
          </div>
          {isRatingModalOpen && (
            <div className="rating-modal">
              <div className="rating-content">
                <h3>Rating</h3>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`rating-star ${
                        ratingValue >= star ? "filled" : ""
                      }`}
                      onClick={() => setRatingValue(star)}
                    />
                  ))}
                </div>
                <button onClick={handleRatingSubmit}>Submit Rating</button>
                <button
                  className="close"
                  onClick={() => setIsRatingModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
