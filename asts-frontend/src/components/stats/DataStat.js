import React, { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////

import LoadingSpinner from "../Loading/LoadingSpinner";
import ContentContainerSecondary from "../ContentContainer/ContentContainerSecondary";
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

  const getHoldingData = async () => {
    try {
      let data = await sendRequest(
        `http://localhost:5000/api/db/funds/change?ticker=${ticker}&fromDate=${weekAgo
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
        `http://localhost:5000/api/fin/quote?ticker=${ticker}`,
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

  useEffect(() => {
    getHoldingData();
    getPriceData();
  }, []);

  return (
    <ContentContainerSecondary>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col">
              <h4>
                {ticker}
                <small> - ticker name</small>
              </h4>
            </div>
          </div>

          <div className="row">
            <div className="col-1" />
            <div className="col-11">
              <h2>
                {!!priceData && !!priceData.currencySymbol
                  ? priceFix(priceData.regularMarketPrice)
                  : defaultStat}
                {!!priceData && (
                  <small
                    className={`ml-3 ${
                      !!priceData &&
                      (priceData.regularMarketChange < 0
                        ? "text-danger"
                        : "text-success")
                    }`}
                  >
                    {priceData.regularMarketChange > 0 && "+"}
                    {priceFix(priceData.regularMarketChange)} |{" "}
                    {Math.abs(percentageFix(priceData.regularMarketChangePercent * 100))}%
                  </small>
                )}
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4 className="ml-2 lead">Held by ARK</h4>
              <ul style={{ "list-style-type": "none" }}>
                <li>
                  <h5>Current shares: </h5>
                  <p className="ml-3">
                    {!!holdingData ? holdingData.shares : defaultStat}
                  </p>
                  <p className={`ml-3`}>
                    {!!holdingData &&
                      !!holdingData.sharesDifference &&
                      holdingData.sharesDifference > 0 &&
                      "+"}
                    {!!holdingData && !!holdingData.sharesDifference
                      ? holdingData.sharesDifference
                      : defaultStat}
                  </p>
                </li>
                <li>
                  <h5>Current market value: </h5>
                  <p className="ml-3">
                    {!!holdingData
                      ? priceFix(holdingData.marketValue)
                      : defaultStat}
                  </p>
                  <p
                    className={`ml-3 ${
                      !!holdingData &&
                      (holdingData.marketValueDifference < 0
                        ? "text-danger"
                        : "text-success")
                    }`}
                  >
                    {!!holdingData &&
                      !!holdingData.marketValueDifference &&
                      holdingData.marketValueDifference > 0 &&
                      "+"}
                    {!!holdingData && !!holdingData.marketValueDifference
                      ? priceFix(holdingData.marketValueDifference)
                      : defaultStat}
                  </p>
                </li>
                <li>
                  <h5>Last updated: </h5>
                  <p className="ml-3">{holdingDate}</p>
                </li>
              </ul>
            </div>

            <div className="col">
              <h4 className="ml-2 lead">On the Market</h4>
              <ul style={{ "list-style-type": "none" }}>
                <li>
                  <h5>Current price: </h5>
                  <p className="ml-3">
                    {!!priceData && !!priceData.currencySymbol
                      ? priceFix(priceData.regularMarketPrice)
                      : defaultStat}
                  </p>
                  {!!priceData && (
                    <p
                      className={`ml-3 ${
                        !!priceData &&
                        (priceData.regularMarketChange < 0
                          ? "text-danger"
                          : "text-success")
                      }`}
                    >
                      {priceData.regularMarketChange > 0 && "+"}
                      {priceFix(priceData.regularMarketChange)} |{" "}
                      {priceData.regularMarketChange > 0 && "+"}
                      {percentageFix(
                        priceData.regularMarketChangePercent * 100
                      )}
                      %
                    </p>
                  )}
                </li>
                <li>
                  <h5>Market: </h5>
                  <p className="ml-3">
                    {!!priceData ? priceData.exchangeName : defaultStat}
                  </p>
                </li>
                <li>
                  <h5>Last updated: </h5>
                  <p className="ml-3">{priceDate}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </ContentContainerSecondary>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default DataStat;
