import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import ThreadForm from './ThreadForm'

export default ({ createThread }) => (
  <main>
    <Container>
      <Row>
        <Col>
          <h2>Create a thread</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <ThreadForm onSubmit={createThread}/>
        </Col>
      </Row>
    </Container>
  </main>
)
