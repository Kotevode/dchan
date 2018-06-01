import React from 'react'
import { reduxForm, Field } from 'redux-form'

let PostForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field name="text"
           component="input"
           type="text"/>
         <button type="submit">
           Send
         </button>
  </form>
)

PostForm = reduxForm({
  form: 'post'
})(PostForm)

export default PostForm
