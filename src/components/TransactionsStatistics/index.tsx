import React from "react";
import "./index.css";

const TransactionsStatistics = ({ statistics, monthName }: any) => {
  return (
    <>
      <div className="">
        <section className="transactions-statistics">
          <div
            className="statistics-container"
            style={{
              borderRadius: "10%",
              padding: 50,
              height: 400,
              width: "80%",
            }}>
            <h2 className="statistics-title">
              <u>Statistics</u> - <i style={{ color: "green" }}>{monthName}</i>
            </h2>
            <div className="statistics-item">
              <p>Total Sale</p>
              <p>{statistics.sales}</p>
            </div>
            <div className="statistics-item">
              <p>Total sold items</p>
              <p>{statistics.soldItems}</p>
            </div>
            <div className="statistics-item">
              <p>Total not sold items</p>
              <p>{statistics.unSoldItems}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TransactionsStatistics;
