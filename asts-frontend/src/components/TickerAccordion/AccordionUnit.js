import React, { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////

import AccordionHead from "./AccordionHead";
import AccordionBody from "./AccordionBody";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

function AccordionUnit(props) {
  const { eventKey, percentageFix, priceFix, holdingData } = props;
  const { fundName, ticker, companyId } = holdingData;
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [priceData, setPriceData] = useState();

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
      if (!!data && !!data.price) {
        setPriceData(data.price);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const headerClickHandler = async () => {
    try {
      if (!priceData) {
        await getPrice();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <AccordionHead
        onClick={headerClickHandler}
        eventKey={eventKey}
        percentageFix={percentageFix}
        priceFix={priceFix}
        companyInfo={holdingData}
        holdingData={holdingData}
      />
      <AccordionBody
        eventKey={eventKey}
        percentageFix={percentageFix}
        priceFix={priceFix}
        companyInfo={holdingData}
        holdingData={holdingData}
        priceData={priceData}
        isLoading={isLoading}
      />
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default AccordionUnit;
