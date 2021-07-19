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
  const { isLoading, error, errorDetails, sendRequest, clearError } = useHttpClient();
  const [tickerStats, setTickerStats] = useState([]);
  const [tickerStatsLoaded, setTickerStatsLoaded] = useState(false);
  const fund = useParams().fundName;

  useEffect(() => {
    const getTickers = async () => {
      let data;
      try {
        data = await sendRequest(
          `http://localhost:5000/api/db/funds/recent?fundType=${fund}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(data);
        let eventKey = -1;
        setTickerStats(
          await data[0].map((tickerObj) => {
            console.log(tickerObj);
            const updatedDate = new Date(tickerObj.date).toString();
            eventKey += 1;
            return (
              <>
                <Accordion.Toggle
                  as={Card.Header}
                  style={{ background: "white", "min-height": "60px", filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2))" }}
                  eventKey={`${eventKey}`}
                >
                  <h3 className="ml-3">{tickerObj.ticker}<small className="text-muted ml-1 ">{tickerObj.companyName}</small></h3>
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
    getTickers();
  }, []);

  return (
    <ContentContainer addClass="p-4">
      {error && <ErrorNotif error={error} errorDetails={errorDetails} />}
      {!error && tickerStatsLoaded && !isLoading ? <Accordion>{tickerStats}</Accordion> :<LoadingSpinner />}
    </ContentContainer>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Fund;
