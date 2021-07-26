import React, { useState, useEffect, useContext } from "react";
import { Dropdown } from "react-bootstrap";
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
  const [sortType, setSortType] = useState("default");

  useEffect(() => {
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
        for (let fundObj in data[0]) {
          if (data[0][fundObj].fundName === fund) {
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
        <ContentContainerHeader height="60px">
          <div className="container">
            <div className="row">
              <div className="col-9">
                <h1>
                  {fund}'s holdings<small>{fullFund}</small>
                </h1>
              </div>
              <div className="col-3">
                <Dropdown>
                  <Dropdown.Toggle variant="light">
                    Sort by
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setSortType("default");
                      }}
                      active={sortType === "default"}
                    >
                      {"Default"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setSortType("alphaUp");
                      }}
                      active={sortType === "alphaUp"}
                    >
                      {"Alphabetically (Ascending)"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setSortType("alphaDown");
                      }}
                      active={sortType === "alphaDown"}
                    >
                      {"Alphabetically (Descending)"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setSortType("sharesUp");
                      }}
                      active={sortType === "sharesUp"}
                    >
                      {"Shares (Ascending)"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setSortType("shareDown");
                      }}
                      active={sortType === "sharesDown"}
                    >
                      {"Shares (Descending)"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setSortType("valueUp");
                      }}
                      active={sortType === "valueUp"}
                    >
                      {"Market Value (Ascending)"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setSortType("valueDown");
                      }}
                      active={sortType === "valueDown"}
                    >
                      {"Market Value (Descending)"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </ContentContainerHeader>
        <div className="p-3">
          <TickerAccordion fund={fund} sortType={sortType} />
        </div>
      </ContentContainer>
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Fund;
