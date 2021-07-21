import React from "react";
import { Accordion, Card, Button } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import LoadingSpinner from "../Loading/LoadingSpinner";

///////////////////////////////////////////////////////////////////////////////////

function AccordionBody(props) {
  const {
    eventKey,
    percentageFix,
    priceFix,
    companyInfo,
    holdingData,
    priceData,
    isLoading,
  } = props;
  const defaultStat = "--:--";
  const holdingDate = !!holdingData
    ? new Date(holdingData.date).toString()
    : defaultStat;
  const priceDate = !!priceData
    ? new Date(priceData.regularMarketTime).toString()
    : defaultStat;

  return (
    <Accordion.Collapse eventKey={`${eventKey}`}>
      <Card.Body style={{ background: "white", "min-height": "60px" }}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col">
                <h4 className="ml-2 lead">Held by {companyInfo.fundName}</h4>
                <ul style={{ "list-style-type": "none" }}>
                  <li>
                    <h5>Current shares: </h5>
                    <p className="ml-3">
                      {!!holdingData ? holdingData.shares : defaultStat}
                    </p>
                    <p
                      className={`ml-3 ${
                        !!holdingData &&
                        (holdingData.sharesDifference < 0
                          ? "text-danger"
                          : "text-success")
                      }`}
                    >
                      {!!holdingData &&
                        !!holdingData.sharesDifference &&
                        holdingData.sharesDifference > 0 &&
                        "+"}
                      {!!holdingData &&
                        !!holdingData.sharesDifference &&
                        holdingData.sharesDifference}
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
                      {!!holdingData &&
                        !!holdingData.marketValueDifference &&
                        priceFix(holdingData.marketValueDifference)}
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
                      {!!priceData
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
                {holdingData.ticker !== ""}
                <div className="d-flex justify-content-end">
                  <Button
                    href={`/history/${holdingData.ticker}`}
                    disabled={holdingData.ticker === ""}
                  >
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Accordion.Collapse>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default AccordionBody;
