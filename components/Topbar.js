import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import React from "react";
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Image from 'next/image'


export default function Topbar() {
  const router = useRouter();
  const getColor = (page) => {
    let pathname = router.pathname;
    if(page != "/" && pathname.indexOf(page) > -1 || pathname == "/" && page == "/"){
      return "text-primary";
    }
    return "text-white";
  };
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
            <Image className="bg-white p-1" src="/barber-shop-svgrepo-com.svg" alt="Logo" width={75} height={35} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link key="home" className={getColor("/")} href="/">Home</Nav.Link>
            <Nav.Link key="about" className={getColor("about")} href="/about">About</Nav.Link>
            <Nav.Link key="contact" className={getColor("contact")} href="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};