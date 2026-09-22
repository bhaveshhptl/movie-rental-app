import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, Modal, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavBar";
import { getMovies } from "../features/movies/movieAPI";
import { createMovie, deleteMovie, updateMovie } from "../features/admin/adminAPI";

const blankMovie = { title: "", genre: "", releaseYear: new Date().getFullYear(), description: "", posterUrl: "", dailyRate: "", copies: "" };

function AdminMovies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const loadMovies = () => { setLoading(true); getMovies({ page: 1, limit: 100 }).then((data) => setMovies(data.movies)).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load movies")).finally(() => setLoading(false)); };
  useEffect(loadMovies, []);
  const save = async () => {
    setSaving(true); setError(null);
    try { if (movie.id) await updateMovie(movie.id, movie); else await createMovie(movie); setMovie(null); loadMovies(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to save movie"); }
    finally { setSaving(false); }
  };
  const remove = async (selectedMovie) => {
    if (!window.confirm(`Delete “${selectedMovie.title}”?`)) return;
    try { await deleteMovie(selectedMovie.id); loadMovies(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to delete movie"); }
  };
  const field = (name, label, type = "text") => <Form.Group className="mb-3"><Form.Label>{label}</Form.Label><Form.Control type={type} value={movie?.[name] ?? ""} onChange={(event) => setMovie({ ...movie, [name]: event.target.value })} /></Form.Group>;
  return <><AppNavbar /><Container className="py-4"><div className="d-flex justify-content-between align-items-center mb-4"><div><h2 className="fw-bold">Manage Movies</h2><p className="text-secondary mb-0">Create, edit, or remove movies in the library.</p></div><div className="d-flex gap-2"><Button variant="outline-light" onClick={() => navigate("/admin")}>Back to dashboard</Button><Button variant="danger" onClick={() => setMovie(blankMovie)}>Add Movie</Button></div></div>{error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}<Card className="bg-dark text-white border-secondary"><Card.Body className="p-0">{loading ? <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div> : <Table responsive variant="dark" hover className="mb-0 align-middle"><thead><tr><th>Movie</th><th>Genre</th><th>Rate</th><th>Availability</th><th className="text-end">Actions</th></tr></thead><tbody>{movies.map((listedMovie) => <tr key={listedMovie.id}><td className="fw-semibold">{listedMovie.title}</td><td>{listedMovie.genre}</td><td>₹{listedMovie.dailyRate}/day</td><td>{listedMovie.availableCopies} / {listedMovie.copies}</td><td className="text-end"><Button size="sm" variant="outline-light" className="me-2" onClick={() => setMovie({ ...listedMovie })}>Edit</Button><Button size="sm" variant="outline-danger" onClick={() => remove(listedMovie)}>Delete</Button></td></tr>)}</tbody></Table>}</Card.Body></Card></Container>
    {movie && <Modal show onHide={() => setMovie(null)} centered contentClassName="bg-dark text-white border-secondary"><Modal.Header closeButton closeVariant="white"><Modal.Title>{movie.id ? "Edit Movie" : "Add Movie"}</Modal.Title></Modal.Header><Modal.Body>{field("title", "Title")}{field("genre", "Genre")}{field("releaseYear", "Release year", "number")}{field("dailyRate", "Daily rate", "number")}{field("copies", "Copies", "number")}{field("posterUrl", "Poster URL")}{field("description", "Description")}</Modal.Body><Modal.Footer><Button variant="outline-light" onClick={() => setMovie(null)}>Cancel</Button><Button variant="danger" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save Movie"}</Button></Modal.Footer></Modal>}
  </>;
}

export default AdminMovies;
