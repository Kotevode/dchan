import React from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap'

const images = (images) => (
  <div className="images">
    { images.map(i => (
      <img src={`http://ipfs.io/ipfs/${i}`}
            key={i}
            width="300"
            height="300"/>
    )) }
  </div>
)

export default ({
  post: {
    hash,
    payload: {
      value: {
        text,
        media
      }
    }
  }
}) => (
  <Card>
    <CardHeader>
      <small>{ hash }</small>
    </CardHeader>
    <CardBody>
      { media && media.images && images(media.images) }
      { text }
    </CardBody>
  </Card>
)
