import React, { useState, useEffect, useContext } from "react";
import { Accordion, Card, Button } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import LoadingSpinner from "../Loading/LoadingSpinner";
import ErrorNotif from "../Error/ErrorNotif";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";
import AccordionUnit from "./AccordionUnit";

///////////////////////////////////////////////////////////////////////////////////

const percentageFix = (x) => {
  return Number(x).toFixed(2);
};
const priceFix = (x, currency) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  });
  return formatter.format(x);
};

function TickerAccordion(props) {
  const { fund } = props;
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [accordionList, setAccordionList] = useState([]);

  useEffect(() => {
    const getAccordion = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/db/funds/companies?fundType=${fund}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(data);
        let eventKey = -1;
        setAccordionList(
          data[0].map((companyInfo) => {
            console.log(companyInfo);
            eventKey += 1;
            console.log(eventKey);
            return (
              <AccordionUnit
                key={eventKey}
                eventKey={eventKey}
                percentageFix={percentageFix}
                priceFix={priceFix}
                companyInfo={companyInfo}
              />
            );
          })
        );
        setCompaniesLoaded(true);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    getAccordion();
  }, []);

  return (
    <>
      {!!error && <ErrorNotif error={error} errorDetails={errorDetails} />}
      {!error && !!companiesLoaded && !isLoading ? (
        <Accordion>{accordionList}</Accordion>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default TickerAccordion;
