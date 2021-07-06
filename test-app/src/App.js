import React, { useState, useEffect } from "react";
import ChartJS from "./components/Chart";
import MadeData from "./components/Data";
import ContentContainer from "./components/ContentContainer/ContentContainer";
import ASTSNavbar from "./components/Navbar/ASTSNavbar";
import { useHttpClient } from "./hooks/http-hook";

const App = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [chartsToDisplay, setChartsToDisplay] = useState([]);
  const [response, setResponse] = useState();
  const today = new Date();
  const date = today.toISOString();

  const getData = async () => {
    const charts = [];
    charts.push(<ChartJS key={1} data={MadeData} />);
    setChartsToDisplay(charts);
  };

  const authSubmitHandler = async () => {
    try {

      const responseData = await sendRequest(
          "http://localhost:5000/api/fin/history",
          "POST",
          JSON.stringify({
            ticker: "TSLA",
            period: "d",
            fromDate: "2000-01-01",
            toDate: date,
          }),
          {
            "Authorization":
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYXJrdXNlciIsImZpcnN0TmFtZSI6Ikphc29uIiwibGFzdE5hbWUiOiJMaSIsImVtYWlsIjoiYXJrc2Vjb25kYXBwQGdtYWlsLmNvbSIsImlhdCI6MTYyNTUyMjQ2NCwiZXhwIjoxNjI1NTI2MDY0fQ.p9cEp6sh6aDF1TsjlqxYOM4TCSPiCmvliazgkZj0100",
            "Content-Type": "application/json",
          }
        );

      console.log(responseData);
      setResponse(responseData.toString()); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYXJrdXNlciIsImZpcnN0TmFtZSI6Ikphc29uIiwibGFzdE5hbWUiOiJMaSIsImVtYWlsIjoiYXJrc2Vjb25kYXBwQGdtYWlsLmNvbSIsImlhdCI6MTYyNTUxOTU3NiwiZXhwIjoxNjI1NTIzMTc2fQ.bIPUq8wlogicBuflj0eYu4tw9PBZizuRtu4KP-yuyEs
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(async () => {
    try {
      getData()
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  return <>{chartsToDisplay}</>;
};

export default App;
