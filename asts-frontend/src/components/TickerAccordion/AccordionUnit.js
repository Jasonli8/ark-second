import React, { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////

import AccordionHead from "./AccordionHead";
import AccordionBody from "./AccordionBody";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

function AccordionUnit(props) {
  const { eventKey, percentageFix, priceFix, companyInfo } = props;
  const { fundName, ticker, companyId } = companyInfo;
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [priceData, setPriceData] = useState();
  const [holdingData, setHoldingData] = useState({});

  const getPrice = async () => {
    try {
      const data = await sendRequest(
        `http://localhost:5000/api/fin/quote?ticker=${ticker}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(data);
      if (!!data && !!data.price) {
        setPriceData(data.price);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const getHolding = async () => {
    try {
      console.log(companyInfo);
      console.log(companyId);
      const data = await sendRequest(
        `http://localhost:5000/api/db/funds/recent?fundType=${fundName}&companyId=${companyId}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(data[0][0]);
      setHoldingData(data[0][0]);
    } catch (err) {
      throw new Error(err);
    }
  };

  const headerClickHandler = async () => {
      console.log(ticker + " header clicked")
    try {
      if (!priceData) {
        await getPrice();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const loadHeaderData = async () => {
      console.log("Loading header data: " + ticker);
      try {
        await getHolding();
      } catch (err) {
        console.log(err);
      }
    };
    loadHeaderData();
  }, [sendRequest]);

  return (
    <>
      <AccordionHead
        onClick={headerClickHandler}
        eventKey={eventKey}
        percentageFix={percentageFix}
        priceFix={priceFix}
        companyInfo={companyInfo}
        holdingData={holdingData}
      />
      <AccordionBody
        eventKey={eventKey}
        percentageFix={percentageFix}
        priceFix={priceFix}
        companyInfo={companyInfo}
        holdingData={holdingData}
        priceData={priceData}
        isLoading={isLoading}
      />
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default AccordionUnit;
