import React from 'react'
import { Container, Row, Col } from 'reactstrap'

export default ({ isLoading, children }) => {
  return isLoading ? (
    <Container>
      <Row>
        <Col>
          Loading...
        </Col>
      </Row>
    </Container>
  ) : children
}
