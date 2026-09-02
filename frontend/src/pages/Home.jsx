import { useEffect, useState } from "react";

import {
  Container,
  Alert,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchMovies,
} from "../features/movies/movieSlice";

import MovieGrid from "../components/MovieGrid";
import MovieFilters from "../components/MovieFilters";
import MoviePagination from "../components/MoviePagination";
import AppNavbar from "../components/AppNavbar";
import MovieCarousel from "../components/MovieCarousel";

function Home() {
  const dispatch = useDispatch();

  const {
    movies,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.movies);

  const [search, setSearch] = useState("");

  const [genre, setGenre] = useState("");

  useEffect(() => {
    dispatch(
      fetchMovies({
        page: 1,
        limit: 8,
        search: "",
        genre: "",
      })
    );
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setSearch(value);

    dispatch(
      fetchMovies({
        page: 1,
        limit: 8,
        search: value,
        genre,
      })
    );
  };

  const handleGenreChange = (value) => {
    setGenre(value);

    dispatch(
      fetchMovies({
        page: 1,
        limit: 8,
        search,
        genre: value,
      })
    );
  };

  const handlePageChange = (page) => {
    dispatch(
      fetchMovies({
        page,
        limit: 8,
        search,
        genre,
      })
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
  <>
    <AppNavbar />

    <Container className="py-4">

      {/* Hero Carousel */}
      <MovieCarousel movies={movies} />

      {/* Page heading */}
      <div className="mb-4">
        <h2 className="fw-bold">
          Browse Movies
        </h2>

        <p className="text-secondary">
          Find your next movie night
        </p>
      </div>

      {/* Search + Genre */}
      <MovieFilters
        search={search}
        genre={genre}
        onSearchChange={handleSearchChange}
        onGenreChange={handleGenreChange}
      />

      {/* Movies */}
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
      />

      {/* Pagination */}
      <MoviePagination
        currentPage={
          pagination?.currentPage ?? 1
        }
        totalPages={
          pagination?.totalPages ?? 1
        }
        onPageChange={handlePageChange}
      />

    </Container>
  </>
);
}

export default Home;