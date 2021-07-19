import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Accordion, Card, Button } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import ErrorNotif from "../../components/Error/ErrorNotif";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

const percentageFix = (x) => {
  return Number.parseFloat(x).toFixed(2);
};
const priceFix = (x) => {
  return Number.parseFloat(x).toFixed(2);
};

function Fund() {
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [tickerStats, setTickerStats] = useState([]);
  const [tickerStatsLoaded, setTickerStatsLoaded] = useState(false);
  const fund = useParams().fundName;

  useEffect(() => {
    const getRecent = async () => {
      let data1;
      let data2;
      let finObj;
      let updatedDateFin;
      try {
        data1 = await sendRequest(
          `http://localhost:5000/api/db/funds/recent?fundType=${fund}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(data1);
        let eventKey = -1;
        setTickerStats(
          await Promise.all(
            data1[0].map(async (tickerObj) => {
              console.log(tickerObj);
              if (tickerObj.ticker !== "") {
                console.log("getting data2");
                try {
                  data2 = await sendRequest(
                    `http://localhost:5000/api/fin/quote?ticker=${tickerObj.ticker}`,
                    "GET",
                    null,
                    {
                      Authorization: "Bearer " + auth.token,
                    }
                  );
                  console.log(data2);
                  finObj = data2.price;
                  updatedDateFin = new Date(
                    finObj.marketState === "CLOSED"
                      ? finObj.postMarketTime
                      : finObj.regularMarketTime
                  ).toString();
                } catch (err) {
                  finObj = null;
                }
              }
              const updatedDateARK = new Date(tickerObj.date).toString();
              eventKey += 1;
              return (
                <>
                  <Accordion.Toggle
                    as={Card.Header}
                    style={{
                      background: "white",
                      "min-height": "60px",
                      filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2))",
                    }}
                    eventKey={`${eventKey}`}
                  >
                    <h3 className="ml-3">
                      {tickerObj.ticker}
                      <small className="text-muted ml-1 ">
                        {tickerObj.companyName}
                      </small>
                    </h3>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={`${eventKey}`}>
                    <Card.Body
                      style={{ background: "white", "min-height": "60px" }}
                    >
                      <div className="container">
                        <div className="row">
                          <div className="col">
                            <h4 className="ml-2 lead">Held by {fund}</h4>
                            <ul style={{ "list-style-type": "none" }}>
                              <li>
                                <h5>Current shares: </h5>
                                <p className="ml-3">{tickerObj.shares}</p>
                                <p
                                  className={`ml-3 ${
                                    tickerObj.sharesDifference < 0
                                      ? "text-danger"
                                      : "text-success"
                                  }`}
                                >
                                  {tickerObj.sharesDifference > 0 && "+"}
                                  {tickerObj.sharesDifference}
                                </p>
                              </li>
                              <li>
                                <h5>Current market value: </h5>
                                <p className="ml-3">
                                  {priceFix(tickerObj.marketValue)}
                                </p>
                                <p
                                  className={`ml-3 ${
                                    tickerObj.marketValueDifference < 0
                                      ? "text-danger"
                                      : "text-success"
                                  }`}
                                >
                                  {tickerObj.marketValueDifference > 0 && "+"}
                                  {priceFix(tickerObj.marketValueDifference)}
                                </p>
                              </li>
                              <li>
                                <h5>Last updated: </h5>
                                <p className="ml-3">{updatedDateARK}</p>
                              </li>
                            </ul>
                          </div>

                          <div className="col">
                            <h4 className="ml-2 lead">On the Market</h4>
                            <ul style={{ "list-style-type": "none" }}>
                              {!!finObj ? (
                                <>
                                  <li>
                                    <h5>Current price: </h5>
                                    <p className="ml-3">
                                      {priceFix(finObj.regularMarketPrice)}
                                    </p>
                                    <p
                                      className={`ml-3 ${
                                        finObj.regularMarketChange < 0
                                          ? "text-danger"
                                          : "text-success"
                                      }`}
                                    >
                                      {finObj.regularMarketChange > 0 && "+"}
                                      {priceFix(
                                        finObj.regularMarketChange
                                      )} |{" "}
                                      {finObj.regularMarketChange > 0 && "+"}
                                      {percentageFix(
                                        finObj.regularMarketChangePercent * 100
                                      )}
                                      %
                                    </p>
                                  </li>
                                  <li>
                                    <h5>Market: </h5>
                                    <p className="ml-3">
                                      {finObj.exchangeName}
                                    </p>
                                  </li>
                                  <li>
                                    <h5>Last updated: </h5>
                                    <p className="ml-3">{updatedDateFin}</p>
                                  </li>
                                </>
                              ) : (
                                <li>Nothing found</li>
                              )}
                            </ul>
                            {tickerObj.ticker !== ""}
                            <div className="d-flex justify-content-end">
                              <Button
                                href={`/history/${tickerObj.ticker}`}
                                disabled={tickerObj.ticker === ""}
                              >
                                More Info
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </>
              );
            })
          )
        );
        setTickerStatsLoaded(true);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    getRecent();
  }, []);

  return (
    <ContentContainer addClass="p-4">
      {!!error && <ErrorNotif error={error} errorDetails={errorDetails} />}
      {!error && !!tickerStatsLoaded && !isLoading ? (
        <Accordion>{tickerStats}</Accordion>
      ) : (
        <LoadingSpinner />
      )}
    </ContentContainer>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Fund;
