import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Accordion, Card } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import ErrorNotif from "../../components/Error/ErrorNotif";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

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
          await data1[0].map((tickerObj) => {
            console.log(tickerObj);
            const getPrice = async (o) => {
              if (tickerObj.ticker !== "") {
                console.log("getting data2")
                try {
                  data2 = await sendRequest(
                    `http://localhost:5000/api/fin/quote?ticker=${o.ticker}`,
                    "GET",
                    null,
                    {
                      Authorization: "Bearer " + auth.token,
                    }
                  );
                } catch (err) {
                  return new Error(err);
                }
                console.log(data2);
                const tickerPrice = data2.price;
                console.log(tickerPrice);
                return tickerPrice;
              }
            };
            const finObj = getPrice(tickerObj);
            const updatedDate = new Date(tickerObj.date).toString();
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
                        <p className="ml-3">{tickerObj.marketValue}</p>
                        <p
                          className={`ml-3 ${
                            tickerObj.marketValueDifference < 0
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {tickerObj.marketValueDifference > 0 && "+"}
                          {tickerObj.marketValueDifference}
                        </p>
                      </li>
                      <li>
                        <h5>Last updated: </h5>
                        <p className="ml-3">{updatedDate}</p>
                      </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </>
            );
          })
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
