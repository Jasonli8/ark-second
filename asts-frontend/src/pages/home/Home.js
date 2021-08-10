import React, { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import ContentContainerHeader from "../../components/ContentContainer/ContentContainerHeader";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import ErrorNotif from "../../components/Error/ErrorNotif";
import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";
import "./Home.css";

///////////////////////////////////////////////////////////////////////////////////

function Home() {
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } = useHttpClient();
  const [fundsLoaded, setFundsLoaded] = useState(false);
  const [fundCollection, setFundCollection] = useState();

  ///////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const getFunds = async () => {
      let data;
      try {
        data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_ROOT}/api/db/funds`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        let cards = data[0].map((fund) => {
          return (
            <div className="col-sm-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{fund.fundName}</h5>
                  <p className="card-text">{fund.description}</p>
                  <a
                    href={`/fund/${fund.fundName}`}
                    className="btn btn-primary"
                  >
                    See details
                  </a>
                </div>
              </div>
            </div>
          );
        });
        let length = data[0].length;
        let collection = [];
        for (var index = 0; index < length; index += 2) {
          if (length - index > 1) {
            collection.push(
              <div className="row my-4">
                {cards[index]}
                {cards[index + 1]}
              </div>
            );
          } else {
            collection.push(
              <div className="row my-3">
                {cards[index]}
              </div>
            )
          }
        }
        setFundCollection(collection)
        setFundsLoaded(true);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    getFunds();
  }, [sendRequest]);

  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <ContentContainer>
        <div className="text-light text-center d-flex justify-content-center p-5">
          <h1>
            <small>Welcome to the</small>
            <br />
            ARK Stock Tracking System
          </h1>
        </div>
        <div className="ark-about text-center p-5">
          <h1>About ARK</h1>
          <br />
          <p className="content p-4 font-italic">
            <big>"</big>
            ARK is a global asset manager specializing in thematic investing in
            disruptive innovation. The firm is rooted in over 40 years of
            experience in investing in technologies that aim to deliver outsized
            growth as industries transform. Through its open research process,
            ARK seeks to identify companies that are leading and benefiting from
            cross-sector innovations such as artificial intelligence, robotics,
            energy storage, DNA sequencing, and blockchain technology.
            <big>"</big>
          </p>
          <Button
            href="https://ark-invest.com/"
            className="p-3 btn btn-secondary"
            style={{ backgroundColor: "#443c66" }}
          >
            Check Out Official Site
          </Button>
        </div>
      </ContentContainer>

      <ContentContainer>
        <ContentContainerHeader height="60px" addClass="text-light">
          <h1>ARK's List of ETFs</h1>
        </ContentContainerHeader>
        <div className="px-3 container">
          {isLoading ? <LoadingSpinner /> : (error ? <ErrorNotif error={error} errorDetails={errorDetails} /> : (fundsLoaded && fundCollection))}
          <div className="row my-5"></div>
        </div>
      </ContentContainer>
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Home;
