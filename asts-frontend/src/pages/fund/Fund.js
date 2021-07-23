import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import ContentContainerHeader from "../../components/ContentContainer/ContentContainerHeader";
import TickerAccordion from "../../components/TickerAccordion/TickerAccordion";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

function Fund() {
  const fund = useParams().fundName;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [fullFund, setFullFund] = useState("");

  useEffect(() => {
    console.log("getFund going")
    const getFund = async () => {
      let data;
      try {
        data = await sendRequest(
          "http://localhost:5000/api/db/funds",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
          if (!data[0]) {
            throw new Error("Empty recordsets from fetch on funds");
          }
          console.log(data);
        for (let fundObj in data[0]) {
          console.log(data[0][fundObj])
          if (data[0][fundObj].fundName === fund) {
            console.log("the one")
            setFullFund(data[0][fundObj].description);
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFund();
  }, []);

  return (
    <>
      <ContentContainer>
        <ContentContainerHeader>
          <h1>
            {fund}'s holdings<small>{fullFund}</small>
          </h1>
        </ContentContainerHeader>
        <div className="p-4">
          <TickerAccordion fund={fund} />
        </div>
      </ContentContainer>
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Fund;
