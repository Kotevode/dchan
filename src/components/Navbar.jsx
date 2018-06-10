import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Navbar,
  NavbarBrand,
  Collapse,
  Nav,
  NavItem
} from 'reactstrap'

export default () => (
  <Container>
    <Row>
      <Col>
        <Navbar color="clear" light expand="md" className="px-0">
          <NavLink to="/" className="navbar-brand">dchan</NavLink>
          <Collapse isOpen={true} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink to="/threads/new">Create thread</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </Col>
    </Row>
  </Container>
)
