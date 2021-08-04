import React, { useContext } from "react";
import { Button } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

function Footer() {
  const auth = useContext(AuthContext);
  ///////////////////////////////////////////////////////////////////////////////////
  return (
    <footer style={{ justifyContent: "center" }}>
      <br />
      <div className="container">
        <div className="text-light row">
          <div className="col-sm-3" />
          <div className="col-sm-6">
            <p>
              This is a third party app designed to track stocks held by ARK
              Invest ETFs. Data displayed here is meant as a reference, but may
              not be accurately representative of real data. All rights are
              reserved to ARK Invest, and this app is for private use only.{" "}
            </p>
            <br />
            <p>
              <strong>Created by:</strong>
              <br />
              Jason Li
              <br />
              jason.ming.li.business@gmail.com
              <br />
              (647) 803-8628
            </p>
          </div>
          <div className="col-sm-3" />
        </div>
      </div>

      <br />
      <Button className="btn btn-secondary p-3" onClick={auth.logout}>
        Logout
      </Button>
    </footer>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Footer;
