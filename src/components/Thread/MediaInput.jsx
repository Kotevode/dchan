import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

import { actions } from '../../models/media'

class MediaInput extends Component {
  state = {
    media: []
  }

  addMedia(name) {
    let { value, onChange } = this.props.input
    onChange([
      ...value,
      name,
    ])
    this.setState({
      ...this.state,
      media: [
        ...this.state.media,
        name
      ]
    })
  }

  upload(accepted) {
    accepted.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const buffer = Buffer.from(reader.result)
        this.props.upload(file.name, buffer)
        this.addMedia(file.name)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  render() {
    return (
      <div className="media-input">
        <Dropzone accept="image/jpeg, image/png"
                  onDrop={(accepted) => this.upload(accepted)}>
          Drop your media here
        </Dropzone>
        <div className="files">
          { this.state.media.map((name) => (
            <div className="media" key={name}>
              {name}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  upload: (name, buffer) => dispatch(actions.uploadMedia(name, buffer))
})

export default connect(null, mapDispatchToProps)(MediaInput)
