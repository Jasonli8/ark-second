import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import CandleStick from "../../components/Graph/CandleStick";
import BarStack from "../../components/Graph/BarStack";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import MadeData from "./testData";

///////////////////////////////////////////////////////////////////////////////////

const ticker = 'TSLA'; //for testing
const period = 'd'

function Test() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [chartsToDisplay, setChartsToDisplay] = useState([]);

  const getData = async () => {
    let formattedData;
    const toDate = (new Date()).toISOString().substring(0, 10);
    const fromDate = (new Date(2010, 1, 1)).toISOString().substring(0, 10);
    try {
      let responseData = await sendRequest(
        `http://localhost:5000/api/fin/history?ticker=${ticker}&period=${period}&fromDate=${fromDate}&toDate=${toDate}`,
        "GET",
        null,
        {
          "Authorization": "Bearer " + auth.token,
        }
      );
      formattedData = responseData.reverse()
      console.log(formattedData)
      const charts = [];
      charts.push(<CandleStick key={1} data={formattedData} />);
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
      <ContentContainer>{!isLoading && chartsToDisplay}</ContentContainer>
    </>
  );
}

export default Test;
