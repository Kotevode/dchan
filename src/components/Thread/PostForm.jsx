import React from 'react'
import {
  Form,
  FormGroup,
  Button,
  Label
} from 'reactstrap'
import { reduxForm, Field } from 'redux-form'

import MediaInput from './MediaInput'

let PostForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Field name="text"
             component="textarea"
             className="form-control"
             type="text"/>
    </FormGroup>
    <FormGroup>
      <Label for="media">Media</Label>
      <Field name="media"
             component={MediaInput}/>
    </FormGroup>
    <Button color="primary">Send</Button>
  </Form>
)

PostForm = reduxForm({
  form: 'post'
})(PostForm)

export default PostForm
