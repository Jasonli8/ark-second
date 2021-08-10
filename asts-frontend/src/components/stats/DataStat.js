import React, { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainerSecondary from "../ContentContainer/ContentContainerSecondary";
import ContentContainerHeader from "../ContentContainer/ContentContainerHeader";
import Summary from "./DataCard/Summary";
import About from "./DataCard/About";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

const percentageFix = (x) => {
  return Number(x).toFixed(2);
};
const priceFix = (x, currency) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
  });
  return formatter.format(x);
};

///////////////////////////////////////////////////////////////////////////////////

function DataStat(props) {
  const today = new Date();
  const weekAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const defaultStat = "--:--";

  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const ticker = props.ticker;
  const [priceData, setPriceData] = useState();
  const [holdingData, setHoldingData] = useState();
  const [holdingDate, setHoldingDate] = useState(defaultStat);
  const [priceDate, setPriceDate] = useState(defaultStat);
  const [selectedTab, setSelectedTab] = useState("about");

  const selectAbout = () => {
    setSelectedTab("about");
  };
  const selectSummary = () => {
    setSelectedTab("summary");
  };

  const getHoldingData = async () => {
    try {
      let data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_ROOT}/api/db/funds/change?ticker=${ticker}&fromDate=${weekAgo
          .toISOString()
          .substring(0, 10)}&toDate=${today.toISOString().substring(0, 10)}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("holding: ");
      console.log(data);
      setHoldingData(data[0]);
      setHoldingDate(new Date(data[0].date).toString());
    } catch (err) {
      console.log(err);
    }
  };

  const getPriceData = async () => {
    try {
      let data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_ROOT}/api/fin/quote?ticker=${ticker}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("price: ");
      console.log(data);
      setPriceData(data.price);
      setPriceDate(new Date(data.price.regularMarketTime).toString());
    } catch (err) {
      console.log(err);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    getHoldingData();
    getPriceData();
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <div style={{position: "relative", bottom: "0"}}>
      <nav>
        <ContentContainerHeader addClass="nav nav-tabs" height="60px" sub>
          <a
            className={`nav-item nav-link ${
              selectedTab === "about" ? "active" : "text-light"
            }`}
            onClick={selectAbout}
          >
            About
          </a>
          <a
            className={`nav-item nav-link ${
              selectedTab === "summary" ? "active" : "text-light"
            }`}
            onClick={selectSummary}
          >
            Summary
          </a>
        </ContentContainerHeader>
      </nav>
      <ContentContainerSecondary>
        <div className="tab-content" style={{ width: "100%" }}>
          <div className="tab-pane fade show active">
            {selectedTab === "about" ? (
              <About
                isLoading={isLoading}
                ticker={ticker}
                priceData={priceData}
                holdingData={holdingData}
                priceDate={priceDate}
                holdingDate={holdingDate}
                priceFix={priceFix}
                percentageFix={percentageFix}
                defaultStat={defaultStat}
              />
            ) : (
              <Summary
                isLoading={isLoading}
                ticker={ticker}
                priceData={priceData}
                holdingData={holdingData}
                priceDate={priceDate}
                holdingDate={holdingDate}
                priceFix={priceFix}
                percentageFix={percentageFix}
                defaultStat={defaultStat}
              />
            )}
          </div>
        </div>
      </ContentContainerSecondary>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default DataStat;
