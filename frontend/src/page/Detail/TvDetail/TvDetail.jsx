import { useEffect, useState } from "react";
import loadingimg from "../../../assets/Animation - 1720970751731.gif";
import Navbar from "../../../components/Navbar/Navbar";
import icon_play from "../../../assets/icon-play.png";
import "./TvDetail.css";
import { Link, useParams } from "react-router-dom";
import { FaHeartCirclePlus, FaStar } from "react-icons/fa6";
import { MdBookmarkAdd } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { BiCategory } from "react-icons/bi";
import { GiWorld } from "react-icons/gi";
import ReviewItem from "../../../components/ReviewsList/ReviewList";
import Similar from "../../../components/Similar/Similar";
import Credits from "../../../components/Credits/Credits";
import tmdbApi from "../../../api/api";
import { tvFavorites, tvWatchLists } from "../../../api/ApiTv";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TvDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tvDetail, seTvDetail] = useState({});
  const [reviewMovieDetail, setReviewMovieDetail] = useState({});
  const { id } = useParams();
  const [currentReviewsIndex, setCurrentReviewsIndex] = useState(0);
  const reviewsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchList, setIsWatchList] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await tmdbApi.getTvDetail(id);
        const responseReview = await tmdbApi.getReviewDetails("tv", id);
        seTvDetail(response);
        setReviewMovieDetail(responseReview.results);

        // Call the tvFavorites.getFavorites function
        const favoriteResponse = await tvFavorites.getFavorites(token);
        const isTvFavorite = favoriteResponse.some((tv) => tv.tvId === id);
        setIsFavorite(isTvFavorite);

        const watchListResponse = await tvWatchLists.getWatchLists(token);
        const isMovieWatchList = watchListResponse.some((tv) => tv.tvId === id);
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
    // Tính toán trang hiện tại dựa trên currentReviewsIndex
    const page = Math.ceil((currentReviewsIndex + 1) / reviewsPerPage);
    setCurrentPage(page);
  }, [currentReviewsIndex]);

  const handleNextReviews = () => {
    setCurrentReviewsIndex((prevIndex) => prevIndex + reviewsPerPage);
  };

  const handlePrevReviews = () => {
    setCurrentReviewsIndex((prevIndex) => prevIndex - reviewsPerPage);
  };

  // Tính toán số lượng trang
  const totalPages = Math.ceil(reviewMovieDetail.length / reviewsPerPage);

  // Render các thanh gạch biểu thị các trang
  const renderPageIndicators = () => {
    const pageIndicators = [];
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage ? "active" : "";
      pageIndicators.push(
        <div
          key={i}
          className={`page-indicator ${isActive}`}
          onClick={() => setCurrentReviewsIndex((i - 1) * reviewsPerPage)}
        ></div>
      );
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
    const handleFavoriteAction = async (action, tvId, userToken) => {
      try {
        const response = await action(tvId, userToken);

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
      ? tvFavorites.deleteFavorite
      : tvFavorites.addFavorite;
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
    const handleWatchListAction = async (action, tvId, userToken) => {
      try {
        const response = await action(tvId, userToken);

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
      ? tvWatchLists.deleteWatchList
      : tvWatchLists.addWatchList;
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
      await tmdbApi.addRating("tv", id, ratingValue);
      setIsRating((prev) => !prev);
      setIsRatingModalOpen(false);
      toast.success("Rating submitted successfully!");
    } catch (error) {
      console.error("Error adding rating:", error);
      toast.error("Failed to submit rating.");
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
          <div className="movie-poster">
            <img
              src={
                "https://image.tmdb.org/t/p/original/" + tvDetail.backdrop_path
              }
              alt="movie-backdrop"
            />
            <Link to={`/player/tv/${tvDetail.id}`} key={tvDetail.id}>
              <img src={icon_play} className="icon-play" alt="" />
            </Link>
            <div className="movie-title">
              <h2>{tvDetail.name}</h2>
              <span>{tvDetail.tagline}</span>
            </div>
            <div className="movie-action">
              <div>
                <button className="btn-play-movie">
                  <FaPlay className="icon-play-movie" />
                  Play Now
                </button>
              </div>
              <div className="icon-action-list">
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
          </div>
          <div className="movie-details-container">
            <div className="movie-details-left">
              <div className="overview">
                <h3>Overview</h3>
                <span className="description">{tvDetail.overview}</span>
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
              <div className="movie-release">
                <h3>
                  <FaRegCalendarAlt />
                  Release Date
                </h3>
                <span>{tvDetail.first_air_date}</span>
              </div>
              <div className="movie-genre">
                <h3>
                  <BiCategory />
                  Genres
                </h3>
                {tvDetail.genres.map((genre, index) => (
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
                {tvDetail.origin_country.map((origin_country, index) => (
                  <button className="btn-country" key={index}>
                    {origin_country}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="credits-movie">
            <h3>Credits</h3>
            <Credits cate="tv" id={tvDetail.id} />
          </div>
          <div className="similar-movie">
            <h3> Similar Tvs</h3>
            <Similar cate="tv" id={tvDetail.id} />
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

export default TvDetail;
