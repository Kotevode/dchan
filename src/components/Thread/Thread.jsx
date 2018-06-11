import React , { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'

import Loader from './Loader'
import PostForm from './PostForm'

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
      <Loader isLoading={this.props.thread.isLoading}>
        <Container>
          <Row>
            <Col>
              {this.props.thread.address}
            </Col>
          </Row>
          <Row>
            <Col>
              <PostForm onSubmit={this.props.send}/>
            </Col>
          </Row>
          <Row>
            <Col>
              { this.props.posts.map(post => (
                <div className="post" key={post.hash}>
                  { post.payload.value.text }
                </div>
              )) }
            </Col>
          </Row>
        </Container>
      </Loader>
    )
  }
}
