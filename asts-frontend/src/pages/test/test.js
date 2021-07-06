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

const ticker = "TSLA"; //for testing

function Test() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [chartsToDisplay, setChartsToDisplay] = useState([]);

  const getData = async () => {
    let formattedData;
    const today = new Date();
    const date = today.toISOString();
    console.log(auth.token);
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/fin/history",
        "GET",
        JSON.stringify({
          ticker: ticker,
          period: "d",
          fromDate: "2000-01-01",
          toDate: `date`,
        }),
        {
          "Authorization": "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      console.log(responseData[1].recordsets);
      formattedData = responseData[1].recordsets;
    } catch (err) {
      console.log(err);
    }
    const charts = [];
    charts.push(<CandleStick key={1} data={formattedData} />);
    setChartsToDisplay(charts);
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <ContentContainer>{!isLoading && chartsToDisplay}</ContentContainer>
    </>
  );
}

export default Test;
