import { useState } from "react";

const SearchBar = ({ onPlaceSelect }) => {
  const [place, setPlace] = useState("");

  const handleSearch = () => {
    if (!place.trim()) return;
    onPlaceSelect(place);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="search-wrapper">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search places"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="search-input"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .search-wrapper {
          display: flex;
          justify-content: center;
          margin: 30px 0 50px;
          width: 100%;
        }

        .search-container {
          display: flex;
          width: 100%;
          max-width: 650px;
          background-color: #ffffff;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .search-input {
          flex: 1;
          padding: 14px 18px;
          border-radius: 12px;
          border: none;
          font-size: 16px;
          color: #333;
        }

        .search-input::placeholder {
          color: #aaa;
        }

        .search-input:focus {
          outline: none;
        }

        .search-button {
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          background-color: #4caf50;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.25s ease, transform 0.1s ease;
        }

        .search-button:hover {
          background-color: #45a049;
        }

        .search-button:active {
          transform: scale(0.97);
        }

        @media (max-width: 600px) {
          .search-container {
            flex-direction: column;
            gap: 10px;
          }

          .search-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default SearchBar;
