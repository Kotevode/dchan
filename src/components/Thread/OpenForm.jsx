import React from 'react'
import { reduxForm, Field } from 'redux-form'

let OpenForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field name="address"
           type="text"
           component="input" />
    <button type="submit">Open</button>
  </form>
)

OpenForm = reduxForm({
  form: 'open'
})(OpenForm)

export default OpenForm
