import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationsList from "./ReservationsList";
import ErrorAlert from "../layout/ErrorAlert";
import { searchReservations } from "../utils/api";

const SearchReservations = () => {
    const history = useHistory();
    const [mobileNumber, setMobileNumber] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [initialState, setInitialState] = useState(true);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleMobileNumberChange = event => {
        setMobileNumber(event.target.value);
    };

    const search = () => {
        const abortController = new AbortController();
        setSearchLoading(true);
        setInitialState(false);
        searchReservations(mobileNumber, abortController.signal)
            .then(reservations => {
                setSearchLoading(false);
                setResults(reservations);
            })
            .catch(setError);

        return () => {
            abortController.abort();
        };
    };

    const findButtonHandler = event => {
        event.preventDefault();
        search();
    };

    const handleEnter = event => {
        if (event.key.toLowerCase() === "enter") {
            event.preventDefault();
        }
    };

    const handleCancel = () => {
        setMobileNumber("");
        history.goBack();
    };

    return (
        <div className="container">
            <h1 className="my-4">Search Reservations</h1>
            <ErrorAlert error={error} />
            <div className="form-container p-3 p-md-5">
                <form
                    className="d-flex flex-column flex-md-row"
                    onSubmit={findButtonHandler}
                >
                    <div className="col-12 col-md-7 col-lg-9 mb-2 mb-md-0 pe-md-2">
                        <div className="form-floating">
                            <label htmlFor="mobile_number" className="form-label">
                                Enter a phone number
                            </label>
                            <input
                                type="text"
                                name="mobile_number"
                                className="form-control"
                                id="mobile_number"
                                autoComplete={"off"}
                                placeholder={"Enter a customer's phone number"}
                                onChange={handleMobileNumberChange}
                                onKeyDown={handleEnter}
                                value={mobileNumber}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-5 col-lg-3 d-flex justify-content-end">
                        <div className="col-6 d-flex pe-1">
                            <button
                                className="btn btn-secondary flex-fill"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="col-6 d-flex ps-1">
                            <button className="btn btn-primary flex-fill" type="submit">
                                Find
                            </button>
                        </div>
                    </div>
                </form>
                <ReservationsList
                    reservations={results}
                    search={true}
                    reservationsLoading={searchLoading}
                    initialState={initialState}
                />
            </div>
        </div>
    );
};

export default SearchReservations;