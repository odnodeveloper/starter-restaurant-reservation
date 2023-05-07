import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";

const CreateTable = () => {
    const history = useHistory();

    const [table, setTable] = useState({
        table_name: "",
        capacity: "",
    });
    const [error, setError] = useState(null);

    const handleTableNameChange = event => {
        setTable({ ...table, table_name: event.target.value });
    };

    const handleCapacityChange = event => {
        setTable({ ...table, capacity: Math.max(1, event.target.value) });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await createTable(table, abortController.signal);
            history.push("/dashboard");
        } catch (error) {
            setError(error);
        }
        return () => abortController.abort();
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="col-12 col-lg-8">
                <h1 className="my-4">Create a New Table</h1>
                <TableForm
                    table={table}
                    error={error}
                    handleTableNameChange={handleTableNameChange}
                    handleCapacityChange={handleCapacityChange}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default CreateTable;