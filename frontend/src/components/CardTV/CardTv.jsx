import { useEffect, useState, useRef } from "react";
import "./CardTv.css";
// import { FaStar } from "react-icons/fa";
import tmdbApi from "../../api/api";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
// eslint-disable-next-line react/prop-types
const CardsTV = ({ title, category, selectedGenre, sortOption }) => {
  const [apiData, setApiData] = useState([]);
  const cardListRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          selectedGenre === "all"
            ? await tmdbApi.getTvsByCategory(
                category ? category : "airing_today"
              )
            : await tmdbApi.getTvsByGenre(selectedGenre);

        // Sắp xếp dữ liệu theo sortOption
        const sortedData = [...response.results].sort((a, b) => {
          switch (sortOption) {
            case "popularity.desc":
              return b.popularity - a.popularity;
            case "popularity.asc":
              return a.popularity - b.popularity;
            case "original_title.asc":
              return a.name.localeCompare(b.name);
            case "original_title.desc":
              return b.name.localeCompare(a.name);
            case "first_air_date.asc":
              return new Date(a.first_air_date) - new Date(b.first_air_date);
            case "first_air_date.desc":
              return new Date(b.first_air_date) - new Date(a.first_air_date);
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
      const cardWidth =
        cardListRef.current.querySelector(".cardTV").offsetWidth;
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
  }, []);

  return (
    <div className="tvCard">
      <h2>
        {title ? title : "Airing Today"}{" "}
        <Link
          to={`/allTvShow?title=${title}&category=${category}&quantity=15`}
          className="see-all"
        >
          See all
        </Link>
      </h2>
      <div className="tv-list" ref={cardListRef}>
        {apiData.map((card, index) => (
          <Link to={`/tvDetail/${card.id}`} className="cardTV" key={index}>
            <div className="tv-image">
              <img
                className="tv-img"
                src={"https://image.tmdb.org/t/p/w500/" + card.poster_path}
                alt=""
              />
            </div>
            <div className="tv-info">
              <p className="tv-title">{card.name}</p>
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

export default CardsTV;
