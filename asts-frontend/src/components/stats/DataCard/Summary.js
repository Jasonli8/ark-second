import React from "react";

///////////////////////////////////////////////////////////////////////////////////

import LoadingSpinner from "../../Loading/LoadingSpinner";

///////////////////////////////////////////////////////////////////////////////////

function Summary(props) {
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
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Summary;
