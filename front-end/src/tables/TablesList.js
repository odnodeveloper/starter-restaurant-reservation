import React from "react";
import TablesListItem from "./TablesListItem";
import { useHistory } from "react-router-dom";

/**
 * Defines the list of tables returned from the database
 * @param tables
 * A possibly empty array of tables
 * @param finishButtonHandler
 * Click handler function for finish button
 * @returns {JSX.Element}
 */
const TablesList = ({ tables, finishButtonHandler }) => {
    const history = useHistory();
    return (
        <div className="my-3 p-2 p-md-3">
            <div className="row d-flex flex-column flex-sm-row flex-wrap p-2">
                <div className="col col-sm-7 d-md-flex flex-column align-items-start mb-2">
                    <h2>{tables.length} Tables</h2>
                </div>
                <div className="col col-sm-5 d-flex justify-content-sm-end align-items-sm-start mt-2 mt-sm-0">
                    <button
                        type="button"
                        name="New Table"
                        className="btn btn-primary flex-fill flex-sm-grow-0"
                        onClick={() => history.push("/tables/new")}
                    >
                        <i className="bi bi-plus-circle-fill me-2"></i>New Table
                    </button>
                </div>
            </div>
            <div className="d-flex flex-row flex-wrap">
                {tables.map(table => {
                    return (
                        <div
                            key={table.table_id}
                            className="d-flex col-12 col-sm-6 col-xl-3 p-1"
                        >
                            <TablesListItem
                                table={table}
                                finishButtonHandler={finishButtonHandler}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TablesList;