import React , { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'

import Loader from './Loader'
import PostForm from './PostForm'
import Post from './Post'

export default class Thread extends Component {
  componentDidMount() {
    if (this.props.thread.closed) {
      this.props.openThread(this.props.thread.address)
    }
  }

  componentWillUnmount() {
    this.props.closeThread(this.props.thread.address)
  }

  render() {
    return (
      <Loader isLoading={this.props.isLoading}>
        <Container>
          <Row className="mb-3">
            <Col>
              <h2>{this.props.initialPost.payload.value.topic}</h2>
              <small>{this.props.thread.address}</small>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              {this.props.initialPost.payload.value.text}
            </Col>
          </Row>
          <Row>
            <Col>
              { this.props.posts.slice(1).map(post => (
                <div className="mb-3" key={post.hash}>
                  <Post post={post}/>
                </div>
              )) }
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <hr/>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <PostForm onSubmit={this.props.send}/>
            </Col>
          </Row>
        </Container>
      </Loader>
    )
  }
}
