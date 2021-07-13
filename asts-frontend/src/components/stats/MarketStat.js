import React, { useState, useEffect, useContext } from "react";
import { Spinner } from "react-bootstrap"

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../ContentContainer/ContentContainer";
import CandleStick from "./Graph/CandleStick";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

const period = "m";

function Ticker(props) {
  const ticker = props.ticker;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [chartsToDisplay, setChartsToDisplay] = useState([]);

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
        let temp = { ...d, date: new Date(d.date) }
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
  }, [sendRequest]);

  return (
    <>
      {!isLoading ? chartsToDisplay : <Spinner animation="grow" variant="light" size='lg' />}
    </>
  );
}

export default Ticker;
