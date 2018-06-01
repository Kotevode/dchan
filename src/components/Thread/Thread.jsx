import React , { Component } from 'react'

import PostForm from './PostForm'

const name = "FooBar"

export default class Thread extends Component {
  componentDidMount() {
    console.log("Thread did mount")
    this.props.createThread(name)
  }

  render() {
    return (
      <main>
        <PostForm onSubmit={this.props.send}/>
      </main>
    )
  }
}
