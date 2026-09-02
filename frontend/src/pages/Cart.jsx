import { useEffect } from "react";

import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Row,
    Spinner,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    checkout,
} from "../features/rental/rentalSlice";

import {
    changeRentalDays,
    deleteCartItem,
    emptyCart,
    fetchCart,
} from "../features/cart/cartSlice";

import AppNavbar from "../components/AppNavbar";

function Cart() {
    const dispatch = useDispatch();

    const {
        items,
        totalCost,
        loading,
        error,
    } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleIncrease = (item) => {
        dispatch(
            changeRentalDays({
                movieId: item.movieId,
                rentalDays:
                    item.rentalDays + 1,
            })
        );
    };

    const handleDecrease = (item) => {
        if (item.rentalDays <= 1) {
            return;
        }

        dispatch(
            changeRentalDays({
                movieId: item.movieId,
                rentalDays:
                    item.rentalDays - 1,
            })
        );
    };

    const handleRemove = (movieId) => {
        dispatch(
            deleteCartItem(movieId)
        ).then(() => {
            dispatch(fetchCart());
        });
    };

    const handleClear = () => {
        dispatch(emptyCart());
    };

    const navigate = useNavigate();

    const {
        loading: checkoutLoading,
        error: checkoutError,
    } = useSelector(
        (state) => state.rental
    );

    const handleCheckout = async () => {
        const result = await dispatch(
            checkout()
        );

        if (checkout.fulfilled.match(result)) {
            navigate("/profile");
        }
    };

    return (
        <>
            <AppNavbar />

            <Container className="py-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">
                            Your Cart
                        </h2>

                        <p className="text-secondary mb-0">
                            Review your selected movies
                        </p>
                    </div>

                    {items.length > 0 && (
                        <Button
                            variant="outline-danger"
                            onClick={handleClear}
                        >
                            Clear Cart
                        </Button>
                    )}
                </div>

                {error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}

                {loading && items.length === 0 ? (
                    <div className="text-center py-5">
                        <Spinner
                            animation="border"
                            variant="danger"
                        />
                    </div>
                ) : items.length === 0 ? (
                    <Card className="bg-dark text-white border-secondary p-5 text-center">
                        <h4>Your cart is empty</h4>

                        <p className="text-secondary">
                            Add some movies from the home page.
                        </p>
                    </Card>
                ) : (
                    <Row className="g-4">

                        <Col lg={8}>

                            {items.map((item) => (
                                <Card
                                    key={item.movieId}
                                    className="bg-dark text-white border-secondary mb-3"
                                >
                                    <Card.Body>
                                        <Row className="align-items-center">

                                            <Col xs={4} md={2}>
                                                <img
                                                    src={
                                                        item.movie?.posterUrl
                                                    }
                                                    alt={
                                                        item.movie?.title
                                                    }
                                                    className="img-fluid rounded"
                                                />
                                            </Col>

                                            <Col xs={8} md={4}>
                                                <h5>
                                                    {item.movie?.title}
                                                </h5>

                                                <small className="text-secondary">
                                                    ₹
                                                    {
                                                        item.movie
                                                            ?.dailyRate
                                                    }{" "}
                                                    / day
                                                </small>
                                            </Col>

                                            <Col
                                                xs={12}
                                                md={3}
                                                className="mt-3 mt-md-0"
                                            >
                                                <div className="d-flex align-items-center gap-2">

                                                    <Button
                                                        size="sm"
                                                        variant="outline-light"
                                                        onClick={() =>
                                                            handleDecrease(
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            item.rentalDays <=
                                                            1
                                                        }
                                                    >
                                                        −
                                                    </Button>

                                                    <span>
                                                        {item.rentalDays} day
                                                        {item.rentalDays > 1
                                                            ? "s"
                                                            : ""}
                                                    </span>

                                                    <Button
                                                        size="sm"
                                                        variant="outline-light"
                                                        onClick={() =>
                                                            handleIncrease(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </Button>

                                                </div>
                                            </Col>

                                            <Col
                                                xs={12}
                                                md={3}
                                                className="text-md-end mt-3 mt-md-0"
                                            >
                                                <div className="fw-bold">
                                                    ₹{item.lineTotal}
                                                </div>

                                                <Button
                                                    variant="link"
                                                    className="text-danger p-0"
                                                    onClick={() =>
                                                        handleRemove(
                                                            item.movieId
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </Col>

                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}

                        </Col>

                        <Col lg={4}>

                            <Card className="bg-dark text-white border-secondary">
                                <Card.Body>

                                    <h4>Order Summary</h4>

                                    <hr />

                                    <div className="d-flex justify-content-between mb-3">
                                        <span>
                                            Movies
                                        </span>

                                        <span>
                                            {items.length}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between fs-5 fw-bold">
                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            ₹{totalCost}
                                        </span>
                                    </div>

                                    {checkoutError && (
                                        <Alert
                                            variant="danger"
                                            className="mt-3"
                                        >
                                            {checkoutError}
                                        </Alert>
                                    )}

                                    <Button
                                        variant="danger"
                                        className="w-100 mt-4"
                                        size="lg"
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading}
                                    >
                                        {checkoutLoading
                                            ? "Processing..."
                                            : "Proceed to Checkout"}
                                    </Button>

                                </Card.Body>
                            </Card>

                        </Col>

                    </Row>
                )}

            </Container>
        </>
    );
}

export default Cart;