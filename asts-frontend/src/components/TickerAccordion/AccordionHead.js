import React from "react";
import { Accordion, Card } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

function AccordionBody(props) {
  const {
    eventKey,
    onClick,
    percentageFix,
    priceFix,
    companyInfo,
    holdingData,
  } = props;
  const defaultStats = "--:--";

  return (
    <Accordion.Toggle
      as={Card.Header}
      style={{
        background: "white",
        "min-height": "60px",
        filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2))",
      }}
      eventKey={`${eventKey}`}
      onClick={onClick}
    >
      <div className="container">
        <div className="row">
          <div className="col-2">
            <h5>{companyInfo.ticker}</h5>
          </div>
          <div className="col-3">
            <p>{companyInfo.companyName}</p>
          </div>
          <div className="col-1">
            <h5>{companyInfo.fundName}</h5>
          </div>
          <div className="col-3">
            <h5>{!!holdingData ? holdingData.shares : defaultStats}</h5>
            <p>{(!!holdingData && holdingData.sharesDifference > 0) && '+'}{!!holdingData ? holdingData.sharesDifference : defaultStats}</p>
          </div>
          <div className="col-3">
            <h5>{!!holdingData ? ("$" + holdingData.marketValue) : defaultStats}</h5>
            <p className={`${(!!holdingData && holdingData.marketValueDifference < 0) ? 'text-danger' : 'text-success'}`}>
              {(!!holdingData && holdingData.marketValueDifference > 0) && '+'}
              {!!holdingData
                ? (priceFix(holdingData.marketValueDifference))
                : defaultStats}
            </p>
          </div>
        </div>
      </div>
    </Accordion.Toggle>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default AccordionBody;
