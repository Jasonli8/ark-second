import React, { useEffect, useState, useContext } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

///////////////////////////////////////////////////////////////////////////////////

import { useHttpClient } from "../../helpers/hooks/http-hook";
import { AuthContext } from "../../contexts/auth-context";

///////////////////////////////////////////////////////////////////////////////////

function ASTSNavbar() {
  const auth = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [fundsLoaded, setFundsLoaded] = useState(false);
  const [fundNav, setFundNav] = useState();

  const searchSubmitHandler = (event) => {
    console.log("submitted");
    console.log(event.search);
    const ticker = event.search.toUpperCase();
    window.location.href = `/history/${ticker}`;
  };

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
        setFundNav(
          await data[0].map((fundObj) => {
            console.log(fundObj);
            return (
              <NavDropdown.Item href={`/fund/${fundObj.fundName}`}>
                {fundObj.fundName}
              </NavDropdown.Item>
            );
          })
        );
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
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: "100vw",
          "z-index": "100",
        }}
      >
        <Navbar
          style={{
            backgroundColor: "#8364FF",
            paddingLeft: "20vw",
            paddingRight: "20vw",
            filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2))",
            width: "100vw",
            position: "fixed",
            display: "block",
            height: "60px",
          }}
          variant="dark"
        >
          <div className="d-flex">
            <Navbar.Brand href="/">ASTS</Navbar.Brand>
            <Navbar.Collapse id="navbar-fund-drop clearfix">
              <Nav>
                <NavDropdown
                  id="nav-fund-drop"
                  title="Funds"
                  menuVariant="dark"
                >
                  {fundsLoaded && !isLoading && fundNav}
                  <NavDropdown.Divider className="d-block d-md-none" />
                  <Form inline onSubmit={handleSubmit(searchSubmitHandler)}>
                    <Form.Group controlId="search">
                      <FormControl
                        type="input"
                        placeholder="Search a ticker"
                        {...register("search", {
                          required: "Can't be empty.",
                        })}
                        className="mx-sm-2 d-flex d-md-none"
                      />
                    </Form.Group>
                  </Form>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            <Form inline onSubmit={handleSubmit(searchSubmitHandler)} className="d-none d-md-flex">
              <Form.Group controlId="search">
                <FormControl
                  type="input"
                  placeholder="Search up a ticker"
                  className="mr-md-2"
                  {...register("search", { required: "Can't be empty." })}
                />
              </Form.Group>

              <Button variant="outline-light" type="submit">
                Search
              </Button>
            </Form>
          </div>
        </Navbar>
      </div>
      <div style={{ height: "60px" }} />
    </>
  );
}

export default ASTSNavbar;
