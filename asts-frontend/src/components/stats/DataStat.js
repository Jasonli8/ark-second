import React, { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainerSecondary from "../ContentContainer/ContentContainerSecondary";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

function DataStat(props) {
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const ticker = props.ticker;
  const [finData, setFinData] = useState();
  const [holdingData, setHoldingData] = useState();

  const today = new Date();
  const weekAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );

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
      setHoldingData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getFinData = async () => {
    try {
      let data = await sendRequest(
        `http://localhost:5000/api/fin/quote?ticker=${ticker}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setFinData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
      getHoldingData();
      getFinData();
  }, []);

  return (
    <ContentContainerSecondary>
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
              $placeholder <small>change</small>
            </h2>
          </div>
        </div>
      </div>
    </ContentContainerSecondary>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default DataStat;
