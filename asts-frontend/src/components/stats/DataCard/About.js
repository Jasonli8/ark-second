import React from "react";

///////////////////////////////////////////////////////////////////////////////////

import LoadingSpinner from "../../Loading/LoadingSpinner";

///////////////////////////////////////////////////////////////////////////////////

function About(props) {
  const {
    isLoading,
    ticker,
    priceData,
    holdingData,
    priceDate,
    holdingDate,
    priceFix,
    percentageFix,
    defaultStat,
  } = props;
  return (
    <>
      {!!holdingData && !!priceData && !isLoading ? (
        <div className="container">
          <div className="row">
            <div className="col">
              <h4>
                {ticker}
                {!!holdingData && <small> - {holdingData.companyName}</small>}
              </h4>
            </div>
          </div>

          <div className="row">
            <div className="col-1" />
            <div className="col-11">
              <h2 className="text-light">
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
                    {Math.abs(
                      percentageFix(priceData.regularMarketChangePercent * 100)
                    )}
                    %
                  </small>
                )}
              </h2>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-12">
              <h4 className="lead">About {holdingData.companyName}</h4>
              <ul style={{ "list-style-type": "none" }}>
                <li>
                  <h5>
                    Full company name:{" "}
                    <small className="ml-1">
                      {!!holdingData.companyName
                        ? holdingData.companyName
                        : defaultStat}
                    </small>
                  </h5>
                </li>
                <li>
                  <h5>
                    Market:{" "}
                    <small className="ml-1">
                      {!!priceData.exchangeName
                        ? priceData.exchangeName
                        : defaultStat}
                    </small>
                  </h5>
                </li>
                <li>
                  <h5>
                    Currency:{" "}
                    <small className="ml-1">
                      {!!priceData.currency
                        ? holdingData.currency
                        : defaultStat}
                    </small>
                  </h5>
                </li>
                <li>
                  <h5>
                    CUSIP:{" "}
                    <small className="ml-1">
                      {!!holdingData.cusip ? holdingData.cusip : defaultStat}
                    </small>
                  </h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default About;
