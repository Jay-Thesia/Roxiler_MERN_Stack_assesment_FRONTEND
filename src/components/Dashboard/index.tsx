import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineAlignRight } from "react-icons/ai";
import { TailSpin } from "react-loader-spinner";
import { MdOutlineSmsFailed } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import TransactionsStatistics from "../TransactionsStatistics/index.tsx";
import StatsChart from "../StatsChart/index.tsx";
import CategoryChart from "../CategoryChart/index.tsx";
import {
  monthsData,
  apiStatusConstant,
} from "../../constatants/dashboard.constant.ts"; // Adjust the import according to your file structure
import "./index.css";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(monthsData[2].monthNo);
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [transactionsData, setTransactionsData] = useState<any>([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstant.initial);
  const [statistics, setStatistics] = useState({});
  const [itemPriceRange, setItemPriceRange] = useState([]);
  const [categories, setCategories] = useState({});
  const [apiStatusStatistics, setApiStatusStatistics] = useState(
    apiStatusConstant.initial
  );

  const getTransactionData = useCallback(async () => {
    try {
      setApiStatus(apiStatusConstant.inprogress);
      const response = await fetch(
        `https://backendof.onrender.com/sales?month=${selectedMonth}&search_q=${searchText}&page=${pageNo}`
      );
      const data = await response.json();
      setTransactionsData(data);
      setApiStatus(apiStatusConstant.success);
    } catch (error: any) {
      setApiStatus(apiStatusConstant.failure);
      console.log(error.message);
    }
  }, [selectedMonth, searchText, pageNo]);

  const getStatisticsData = useCallback(async () => {
    try {
      setApiStatusStatistics(apiStatusConstant.inprogress);
      const response = await fetch(
        `https://backendof.onrender.com/all-statistics?month=${selectedMonth}`
      );
      const data = await response.json();
      setStatistics(data.statistics);
      setItemPriceRange(data.itemPriceRange);
      setCategories(data.categories);
      setApiStatusStatistics(apiStatusConstant.success);
    } catch (error: any) {
      setApiStatusStatistics(apiStatusConstant.failure);
      console.log(error.message);
    }
  }, [selectedMonth]);

  useEffect(() => {
    getTransactionData();
    getStatisticsData();
  }, [getTransactionData, getStatisticsData]);

  const next = () => {
    if (transactionsData.length / 10 > pageNo) {
      setPageNo((prevPageNo) => prevPageNo + 1);
    }
  };

  const prev = () => {
    if (pageNo >= 2) {
      setPageNo((prevPageNo) => prevPageNo - 1);
    }
  };

  const changeMonth = (event: any) => {
    setSelectedMonth(event.target.value);
    setPageNo(1);
  };

  const updateSearch = (event: any) => {
    setSearchText(event.target.value);
  };

  const getTransactionTable = () => {
    if (transactionsData.length === 0)
      return (
        <div className="empty-view">
          <AiOutlineAlignRight size={50} />
          <h2>No Transactions Found</h2>
        </div>
      );
    return (
      <table border={1} className="transaction-table">
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>price</th>
            <th>description</th>
            <th>category</th>
            <th>image</th>
            <th>sold</th>
          </tr>
        </thead>
        <tbody>
          {transactionsData &&
            transactionsData.map((each: any) => {
              return (
                <tr key={crypto.randomUUID()}>
                  <td className="center">{each.id}</td>
                  <td>{each.title}</td>
                  <td className="center">{each.price} Rs</td>
                  <td>{each.description}</td>
                  <td className="center">{each.category}</td>
                  <td className="center">
                    <img
                      src={each.image}
                      height={40}
                      width={40}
                      alt={each.title}
                    />
                  </td>
                  <td className="sold-status">
                    {each.sold ? (
                      <img src="/images/sold.svg" alt="" />
                    ) : undefined}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };

  const loadingView = () => {
    return (
      <div className="loading-view">
        <TailSpin
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  const failureView = (func: any) => {
    return (
      <div className="failure-view">
        <MdOutlineSmsFailed size={40} />
        <h2>Oops! Something Went Wrong</h2>
        <button className="retry-button" type="button" onClick={() => func()}>
          Try again
        </button>
      </div>
    );
  };

  const getStatisticsSuccessView = () => {
    const name = monthsData.find(
      (each: any) => String(each.monthNo) === String(selectedMonth)
    ).monthName;

    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <TransactionsStatistics
            // monthNo={selectedMonth}
            monthName={name}
            statistics={statistics}
          />
          <CategoryChart monthName={name} categories={categories} />
        </div>
        <div className="">
          <StatsChart monthName={name} itemPriceRange={itemPriceRange} />
        </div>
      </>
    );
  };

  const getStatisticsView = () => {
    switch (apiStatusStatistics) {
      case apiStatusConstant.inprogress:
        return loadingView();
      case apiStatusConstant.success:
        return getStatisticsSuccessView();
      case apiStatusConstant.failure:
        return failureView(getStatisticsData);
      default:
        return null;
    }
  };

  const getTransactionView = () => {
    switch (apiStatus) {
      case apiStatusConstant.inprogress:
        return loadingView();
      case apiStatusConstant.success:
        return getTransactionTable();
      case apiStatusConstant.failure:
        return failureView(getTransactionData);
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title" style={{ textAlign: "center" }}>
          Product Transaction Dashboard
        </h1>
      </header>
      <main className="dashboard-main">
        <section className="input-section">
          <div className="input-container">
            <IoSearchOutline size={20} />
            <input
              type="search"
              placeholder="Search Transactions"
              className="search-input"
              onChange={updateSearch}
            />
          </div>
          <div className="input-container">
            <select
              className="search-input"
              onChange={changeMonth}
              value={selectedMonth}>
              {monthsData.map((each: any) => (
                <option key={crypto.randomUUID()} value={each.monthNo}>
                  {each.monthName}
                </option>
              ))}
            </select>
          </div>
        </section>
        <section className="transactions-section">
          {getTransactionView()}
        </section>
        <section className="pagination-container">
          <p>Page No : {pageNo}</p>
          <div className="pagination-buttons">
            <button type="button" onClick={prev} disabled={pageNo === 1}>
              Prev
            </button>
            &nbsp;-&nbsp;
            <button type="button" onClick={next}>
              Next
            </button>
          </div>
          <p>Per Page : 10</p>
        </section>
        {getStatisticsView()}
      </main>
    </div>
  );
};

export default Dashboard;
