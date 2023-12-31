import React from "react";
import { Link } from "react-router-dom"; //provides Link component
// import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { auth } from "../firebase";
import App from "./App";

// const LinkTo = styled.link`
//   color: white;
//   `;

// const StyledWrapper = styled.section`
//   `;


function Header(props) {
  return (
    <React.Fragment>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Epicodus Help Queue</Navbar.Brand>
            <Nav className="ms-auto">
            <Navbar.Text className="ml-3">
              {props.currentUser ? (`Currently Signed in: ${props.currentUser.email}`) : ("Not Signed in")}
            </Navbar.Text>              
            <Button style={{ marginLeft: "1rem", }} variant="outline-primary"><Link to="/sign-in">{props.currentUser ? "Sign Out" : "Sign In"}</Link></Button>
            <Button style={{ marginLeft: "1rem", }} variant="outline-primary"><Link to="/">Home</Link></Button>
            </Nav>
        </Container>
      </Navbar>
    </React.Fragment>
  );
}

export default Header;
