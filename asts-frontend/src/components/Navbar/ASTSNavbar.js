import React from "react";
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';

function ASTSNavbar() {
  return (
    <>
      <Navbar style={{backgroundColor: "#8364FF", paddingLeft: "20vw", paddingRight: "20vw", filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.2))"}} variant="dark">
        <Navbar.Brand href="#home">ASTS</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="">nav1</Nav.Link>
          <Nav.Link href="">nav2</Nav.Link>
          <Nav.Link href="">nav3</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-light">Search</Button>
        </Form>
      </Navbar>
    </>
  );
}

export default ASTSNavbar;
