import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import React from "react";
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

export default function Topbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const getColor = (page) => {
    let pathname = router.pathname;
    if(page != "/" && pathname.indexOf(page) > -1 || pathname == "/" && page == "/"){
      return "text-primary";
    }
    return "text-white";
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand href="/">
            <Image className="bg-white p-1" src="/images/logo.svg" alt="Logo" width={75} height={35} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {
          session ?
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link key="home" className={getColor("/")} href="/">Home</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title="More">
                  <NavDropdown.Item onClick={()=>signOut()}>Log out</NavDropdown.Item> 
                  <NavDropdown.Item  href="/auth/reset-password">reset password</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse> 
          :
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link key="contact" className={getColor("/contact")} href="/contact">Contact</Nav.Link>
              <Nav.Link key="Pricing" className={getColor("/Pricing")} href="/Pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link key="Login" className={getColor("/auth/signin")} href="/auth/signin">
                <Button variant="primary" size="sm">
                  Log In
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse> 
        }
      </Container>
    </Navbar>
  );
};