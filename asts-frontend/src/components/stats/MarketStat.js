import React, { useState, useEffect, useContext } from "react";
import { Spinner, Dropdown } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../ContentContainer/ContentContainer";
import CandleStick from "./Graph/CandleStick";
import ErrorModal from '../Error/ErrorModal'
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

function Ticker(props) {
  const ticker = props.ticker;
  const [period, setPeriod] = useState("d");
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } = useHttpClient();
  const [chartsToDisplay, setChartsToDisplay] = useState([]);

  ///////////////////////////////////////////////////////////////////////////////////

  const getData = async () => {
    let formattedData;
    const toDate = new Date().toISOString().substring(0, 10);
    const fromDate = new Date(2010, 1, 1).toISOString().substring(0, 10);
    try {
      let responseData = await sendRequest(
        `http://localhost:5000/api/fin/history?ticker=${ticker}&period=${period}&fromDate=${fromDate}&toDate=${toDate}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const reversedData = responseData.reverse();
      formattedData = reversedData.map((d) => {
        let temp = { ...d, date: new Date(d.date) };
        return temp;
      });
      const charts = [];
      charts.push(
        <CandleStick
          key={1}
          data={formattedData}
          ticker={ticker}
          height={600}
          width={900}
        />
      );
      setChartsToDisplay(charts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [sendRequest, period]);

  ///////////////////////////////////////////////////////////////////////////////////

  const selectDaily = () => {
    setPeriod("d");
  };
  const selectWeekly = () => {
    setPeriod("w");
  };
  const selectMonthly = () => {
    setPeriod("m");
  };
  const selectDividend = () => {
    setPeriod("v");
  };

  ///////////////////////////////////////////////////////////////////////////////////

  // some tickers dont have dividends, dividend period disabled temporarily
  return (
    <>
      <ErrorModal error={error} errorDetails={errorDetails} clearError={clearError} />
      <div className="d-flex justify-content-center py-2 px-5">
        <Dropdown>
          <Dropdown.Toggle variant="light">Select period</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={selectDaily} active={period === "d"}>
              Daily
            </Dropdown.Item>
            <Dropdown.Item onClick={selectWeekly} active={period === "w"}>
              Weekly
            </Dropdown.Item>
            <Dropdown.Item onClick={selectMonthly} active={period === "m"}>
              Monthly
            </Dropdown.Item>
            <Dropdown.Item
              onClick={selectDividend}
              active={period === "v"}
              disabled
            >
              Every dividend
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {period && !isLoading ? (
        chartsToDisplay
      ) : (
        <Spinner animation="grow" variant="light" size="lg" />
      )}
    </>
  );
}

export default Ticker;
