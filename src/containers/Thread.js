import { connect } from 'react-redux'

import Thread from '../components/Thread'
import { actions } from '../models/threads'

const getThread = (state, address) => state.entities.threads[address]
const getThreadView = (state, address) => state.views.threads[address]

const mapStateToProps = (state, props) => {
  let { manifest, name } = props.match.params
  let address = `/orbitdb/${manifest}/${name}`
  let thread = getThread(state, address) || {
    address,
    closed: true
  }
  let threadView = getThreadView(state, address) || {
    isLoading: true
  }
  console.log(thread)
  let posts = thread.posts || []
  let initialPost = posts.length > 0 ? posts[0] : {
    payload: {
      value: {
        topic: 'A new thread',
        text: 'Hello world'
      }
    }
  }
  return {
    thread,
    posts,
    initialPost,
    isLoading: threadView.isLoading,
    uploads: state.entities.uploads
  }
}

const reattachMedia = (uploads, post) => {
  let media = post.media.reduce((media, fileName) => {
    if (fileName.search(/\*.(jpg|jpeg|png)/)) {
      media.images = [
        ...media.images,
        uploads[fileName]
      ]
    }
    return media
  }, {
    images: []
  })
  return {
    ...post,
    media
  }
}

const mergeProps = (state, { dispatch }) => {
  let { address } = state.thread
  return {
    ...state,
    openThread: (address) => dispatch(actions.openThread(address)),
    closeThread: (address) => dispatch(actions.closeThread(address)),
    send: (values) => {
      values = reattachMedia(state.uploads, values)
      dispatch(actions.addPost(address, values))
    }
  }
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(Thread)
