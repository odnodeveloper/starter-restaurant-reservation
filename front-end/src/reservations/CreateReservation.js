import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";

const CreateReservation = () => {
    const history = useHistory();

    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
        status: "booked",
    });

    const [error, setError] = useState(null);

    const handleChange = event => {
        setReservation({
            ...reservation,
            [event.target.name]: event.target.value,
        });
    };

    const handlePeopleNumberChange = event => {
        setReservation({
            ...reservation,
            people: Math.max(1, event.target.value)
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await createReservation(reservation, abortController.signal);
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        } catch (error) {
            setError(error);
        }
        return () => abortController.abort();
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="col-12 col-lg-8">
                <h1 className="my-4">Create a new reservation</h1>
                <ReservationForm
                    reservation={reservation}
                    error={error}
                    handleChange={handleChange}
                    handlePeopleNumberChange={handlePeopleNumberChange}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default CreateReservation;