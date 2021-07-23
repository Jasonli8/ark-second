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
    style: "currency",
    currency: currency || "USD",
  });
  return formatter.format(x);
};

function TickerAccordion(props) {
  const { fund, sortType } = props;
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [accordionList, setAccordionList] = useState([]);

  useEffect(() => {
    const getAccordion = async () => {
      console.log(sortType);
      try {
        let dataCompany = await sendRequest(
          `http://localhost:5000/api/db/funds/companies?fundType=${fund}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        let data = await Promise.all(dataCompany[0].map((companyInfo) => {
          const getHolding = async () => {
            try {
              const dataHolding = await sendRequest(
                `http://localhost:5000/api/db/funds/recent?fundType=${companyInfo.fundName}&companyId=${companyInfo.companyId}`,
                "GET",
                null,
                {
                  Authorization: "Bearer " + auth.token,
                }
              );
              const appendHolding = {...companyInfo, ...dataHolding[0][0]}
              console.log(appendHolding);
              return appendHolding;
            } catch (err) {
              console.log(err);
            }
          }
          const appendedHolding = getHolding();
          return appendedHolding;
        }))
        console.log(data);
        let eventKey = -1;
        const unsortedData = data;
        let sortedData;
        switch (sortType) {
          case "alphaUp":
            sortedData = unsortedData.sort((a,b) => {
              if (a.ticker < b.ticker) {
                return -1;
              }
              return 1;
            })
            break;
          case "alphaDown":
            sortedData = unsortedData.sort((a,b) => {
              if (a.ticker > b.ticker) {
                return -1;
              }
              return 1;
            })
            break;
          case "sharesUp":
            sortedData = unsortedData.sort((a,b) => {
              if (a.sharesDifference < b.sharesDifference) {
                return -1;
              }
              return 1;
            })
            break;
          case "sharesDown":
            sortedData = unsortedData.sort((a,b) => {
              if (a.sharesDifference > b.sharesDifference) {
                return -1;
              }
              return 1;
            })
            break;
          case "valueUp":
            sortedData = unsortedData.sort((a,b) => {
              if (a.marketValueDifference < b.marketValueDifference) {
                return -1;
              }
              return 1;
            })
            break;
          case "valueDown":
            sortedData = unsortedData.sort((a,b) => {
              if (a.marketValueDifference > b.marketValueDifference) {
                return -1;
              }
              return 1;
            })
            break;
          default:
            sortedData = unsortedData;
        }
        const sortedList = sortedData.map((data) => {
          eventKey += 1;
          return (
            <AccordionUnit
              key={eventKey}
              eventKey={eventKey}
              percentageFix={percentageFix}
              priceFix={priceFix}
              holdingData={data}
            />
          );
        })

        setAccordionList(sortedList);
        setCompaniesLoaded(true);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    getAccordion();
  }, [sortType]);

  return (
    <>
      {!!error && <ErrorNotif error={error} errorDetails={errorDetails} />}
      {!error && !!companiesLoaded && !isLoading ? (
        <Accordion className="p-3">{accordionList}</Accordion>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default TickerAccordion;
