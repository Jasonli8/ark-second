import React, { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////

import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

function Test() {
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const today = new Date();
  const weekAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  const defaultStat = "--:--";
  const period = "d";
  const getHoldingData = async () => {
    try {
      let data = await sendRequest(
        `http://localhost:5000/api/fin/history?ticker=asdf&period=${period}&fromDate=${weekAgo.toISOString().substring(0, 10)}&toDate=${today.toISOString().substring(0, 10)}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log("holding: ");
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHoldingData();
  }, []);

  return <p className="text-light">hello {!!error && error + errorDetails}</p>;
}

export default Test;
