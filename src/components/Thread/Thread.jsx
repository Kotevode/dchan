import React , { Component } from 'react'

import PostForm from './PostForm'
import OpenForm from './OpenForm'

export default class Thread extends Component {
  // componentDidMount() {
  //   this.props.createThread(name)
  // }

  render() {
    return (
      <main>
        <div>
          {this.props.address}
        </div>
        <button onClick={() => this.props.createThread(`${Math.floor(Math.random() * 1e5)}`)}>
          Create
        </button>
        <OpenForm onSubmit={this.props.openThread}/>
        <PostForm onSubmit={this.props.send}/>
        <div className="posts">
          { this.props.posts.map(post => (
            <div className="post" key={post.hash}>
              { post.payload.value.text }
            </div>
          )) }
        </div>
      </main>
    )
  }
}
