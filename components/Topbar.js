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
  let navItems = <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link key="contact" className={getColor("/contact")} href="/contact">Contact</Nav.Link>
                  <Nav.Link key="Pricing" className={getColor("/pricing")} href="/pricing">Pricing</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link key="Login" className={getColor("/auth/signin")} href="/auth/signin">
                    <Button variant="primary" size="sm">
                      Log In
                    </Button>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>;
  if(session){
    let roleSpecificItems;
    if(session.role === "teacher"){
      roleSpecificItems = <Nav.Link key="dashboard" className={getColor("/teacher/dashboard")} href="/teacher/dashboard">Dashboard</Nav.Link>;
    }
    else{
      roleSpecificItems = [
                          <Nav.Link key="dashboard" className={getColor("/student/dashboard")}  href="/student/dashboard">Dashboard</Nav.Link>,
                          <Nav.Link key="searchCourse" className={getColor("/student/searchCourse")} href="/student/searchCourse">Enroll</Nav.Link>
                        ];
    }
    navItems = <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                  {roleSpecificItems}
              </Nav>
              <Nav>
                <NavDropdown title="More">
                    <NavDropdown.Item onClick={()=>signOut()}>Log out</NavDropdown.Item> 
                    <NavDropdown.Item  href="/auth/reset-password">reset password</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>;
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand href="/">
            <Image src="/media/images/logo.svg" alt="Logo" width={75} height={35} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        { navItems }
      </Container>
    </Navbar>
  );
};