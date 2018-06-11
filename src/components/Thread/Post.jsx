import React from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap'

export default ({ post }) => (
  <Card>
    <CardHeader>
      <small>{ post.hash }</small>
    </CardHeader>
    <CardBody>
      { post.payload.value.text}
    </CardBody>
  </Card>
)
