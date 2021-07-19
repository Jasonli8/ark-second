import React, { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../ContentContainer/ContentContainer";
import BarStack from "./Graph/BarStack";
import ErrorNotif from '../Error/ErrorNotif'
import LoadingSpinner from "../Loading/LoadingSpinner";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

const fundType = "ARKK,ARKQ,ARKW";
const funds = ["ARKK", "ARKQ", "ARKW"];
const period = "d";

function Test(props) {
  const ticker = props.ticker;
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } = useHttpClient();
  const [chartsToDisplay, setChartsToDisplay] = useState([]);

  const getData = async () => {
    let formattedData = [];
    const today = new Date();
    const toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString().substring(0, 10);
    const fromDate = new Date(2021, 5, 19).toISOString().substring(0, 10);
    try {
      let responseData1 = await sendRequest(
        `http://localhost:5000/api/db/funds/holdings/ticker?fundType=${fundType}&ticker=${ticker}&fromDate=${fromDate}&toDate=${toDate}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      let responseData2 = await sendRequest(
        `http://localhost:5000/api/fin/history?ticker=${ticker}&period=${period}&fromDate=${fromDate}&toDate=${today.toISOString().substring(0, 10)}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      let cumulativeHolding;
      let currDate;
      let filledFunds = [];
      for (var data in responseData1) {
        if (responseData1[data].date !== currDate) {
          if (cumulativeHolding) {
            for (var fund in funds) {
              if (filledFunds[fund] === 0) {
                let name = funds[fund];
                let holding = 0;
                let tempHolding = {
                  ...cumulativeHolding,
                  [`${name}`]: name,
                  [`${funds[fund]}Holding`]: holding,
                };
                cumulativeHolding = tempHolding;
              }
            }
            formattedData.push(cumulativeHolding);
          }
          filledFunds = [];
          for (var fund in funds) {
            filledFunds.push(0);
          }
          currDate = responseData1[data].date;
          const closeIndex = responseData2.findIndex((d) => {
            return (d.date).substring(0, 10) === currDate.substring(0, 10);
          });
          cumulativeHolding = {
            date: new Date(responseData1[data].date),
            close: responseData2[closeIndex].close,
          };
        }
        let name = responseData1[data].fundName;
        let holding = responseData1[data].shares;
        let tempHolding = {
          ...cumulativeHolding,
          [`${name}`]: name,
          [`${name}Holding`]: holding,
        };
        for (var fund in funds) {
          if (name === funds[fund]) {
            filledFunds[fund] = 1;
          }
        }
        cumulativeHolding = tempHolding;
      }
      if (cumulativeHolding) {
        for (var fund in funds) {
          if (filledFunds[fund] === 0) {
            let name = funds[fund];
            let holding = 0;
            let tempHolding = {
              ...cumulativeHolding,
              [`${name}`]: name,
              [`${funds[fund]}Holding`]: holding,
            };
            cumulativeHolding = tempHolding;
          }
        }
        formattedData.push(cumulativeHolding);
      }
      filledFunds = [];
      for (var fund in funds) {
        filledFunds.push(0);
      }
      currDate = responseData1[data].date;
      cumulativeHolding = { date: responseData1[data].date };

      const charts = [];
      charts.push(
        <BarStack
          key={1}
          data={formattedData}
          funds={funds}
          ticker={ticker}
          width={900}
          height={500}
        />
      );
      setChartsToDisplay(charts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    clearError();
    getData();
  }, [sendRequest]);

  return (
    <>
      {error && <ErrorNotif error={error} errorDetails={errorDetails} />}
      {!isLoading ? chartsToDisplay : <LoadingSpinner />}
    </>
  );
}

export default Test;
