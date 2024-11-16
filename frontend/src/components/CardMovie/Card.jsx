import { Link } from "react-router-dom";
import "./Card.css";
import { useEffect, useState, useRef } from "react";
import tmdbApi from "../../api/api";
// import { FaStar } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
// eslint-disable-next-line react/prop-types
const Cards = ({ title, category, selectedGenre, sortOption }) => {
  const [apiData, setApiData] = useState([]);
  const cardListRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          selectedGenre === "all"
            ? await tmdbApi.getMoviesByCategory(
                category ? category : "now_playing"
              )
            : await tmdbApi.getMoviesByGenre(selectedGenre);

        // Sắp xếp dữ liệu theo sortOption
        const sortedData = [...response.results].sort((a, b) => {
          switch (sortOption) {
            case "popularity.desc":
              return b.popularity - a.popularity;
            case "popularity.asc":
              return a.popularity - b.popularity;
            case "original_title.asc":
              return a.title.localeCompare(b.title);
            case "original_title.desc":
              return b.title.localeCompare(a.title);
            case "release_date.asc":
              return new Date(a.release_date) - new Date(b.release_date);
            case "release_date.desc":
              return new Date(b.release_date) - new Date(a.release_date);
            default:
              return 0;
          }
        });

        setApiData(sortedData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [category, selectedGenre, sortOption]);

  const scrollHandler = (direction) => {
    if (cardListRef.current) {
      const cardWidth = cardListRef.current.querySelector(".card").offsetWidth;
      const visibleCards = Math.floor(
        cardListRef.current.offsetWidth / cardWidth
      );
      const scrollAmount = cardWidth * visibleCards;

      if (direction === "right") {
        cardListRef.current.scrollLeft += scrollAmount;
        setIsScrolled(cardListRef.current.scrollLeft > 0); // Chỉ cập nhật nếu có thể cuộn
      } else if (direction === "left") {
        cardListRef.current.scrollLeft -= scrollAmount;
        setIsScrolled(cardListRef.current.scrollLeft > 0); // Kiểm tra nếu có thể cuộn trái
      }
    }
  };

  const scrollRight = () => scrollHandler("right");
  const scrollLeft = () => scrollHandler("left");

  useEffect(() => {
    const handleScroll = () => {
      if (cardListRef.current) {
        setIsScrolled(cardListRef.current.scrollLeft > 0);
      }
    };

    if (cardListRef.current) {
      cardListRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (cardListRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cardListRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Chạy effect này chỉ 1 lần khi component mount

  return (
    <div className="cards">
      <h2>
        {title ? title : "Now Playing"}{" "}
        <Link
          to={`/allMovies?title=${title}&category=${category}`}
          className="see-all"
        >
          See all
        </Link>
      </h2>
      <div className="card-list" ref={cardListRef}>
        {apiData.map((card, index) => (
          <Link to={`/movieDetail/${card.id}`} className="card" key={index}>
            <div className="card-image">
              <img
                className="card-img"
                src={"https://image.tmdb.org/t/p/w500/" + card.poster_path}
                alt=""
              />
            </div>
            <div className="card-info">
              {/* <div className="card-sub-info">
                <p className="card-year">{card.release_date}</p>
                <p className="card-rating">
                  {card.vote_average.toFixed(1)}
                  <FaStar className="icon-star" />
                </p>
              </div> */}
              <p className="card-title">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <button className="load-more-btn" onClick={scrollRight}>
        <MdOutlineKeyboardArrowRight className="icon-more" />
      </button>
      {isScrolled && (
        <button className="load-less-btn" onClick={scrollLeft}>
          <MdOutlineKeyboardArrowLeft className="icon-less" />
        </button>
      )}
    </div>
  );
};

export default Cards;
