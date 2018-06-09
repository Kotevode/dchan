import React from 'react'
import { Link } from 'react-router-dom'
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
          <NavbarBrand href="/">dchan</NavbarBrand>
          <Collapse isOpen={true} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link to="/threads/new">Create thread</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </Col>
    </Row>
  </Container>
)
