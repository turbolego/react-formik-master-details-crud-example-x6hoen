import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { userService, alertService } from '../_services';

class AddEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      isAddMode: !props.match.params.id,
      user: {},
      showPassword: false,
    };
    this.formikRef = null;
  }

  componentDidMount() {
    const { id, isAddMode } = this.state;
    if (!isAddMode) {
      // get user and set form fields
      userService.getById(id).then((user) => {
        const fields = [
          'foretak',
          'firstName',
          'lastName',
          'email',
          'driftssenter',
          'role',
        ];
        fields.forEach((field) =>
          this.setFieldValue(field, user[field], false)
        );
        this.setState({ user });
      });
    }
  }

  createUser(fields, setSubmitting) {
    userService
      .create(fields)
      .then(() => {
        alertService.success('User added', { keepAfterRouteChange: true });
        this.props.history.push('.');
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  updateUser(id, fields, setSubmitting) {
    userService
      .update(id, fields)
      .then(() => {
        alertService.success('User updated', { keepAfterRouteChange: true });
        this.props.history.push('..');
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  onSubmit = (fields, { setStatus, setSubmitting }) => {
    setStatus();
    const { id, isAddMode } = this.state;
    if (isAddMode) {
      this.createUser(fields, setSubmitting);
    } else {
      this.updateUser(id, fields, setSubmitting);
    }
  };

  setFieldValue(field, value, shouldValidate = true) {
    if (shouldValidate) {
      this.formikRef.setFieldValue(field, value, shouldValidate);
    } else {
      this.formikRef.setFieldValue(field, value);
    }
  }

  render() {
    const { isAddMode, user, showPassword } = this.state;

    const initialValues = {
      foretak: '',
      firstName: '',
      lastName: '',
      email: '',
      driftssenter: '',
      role: '',
      password: '',
      confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
      foretak: Yup.string().required('Foretaksnavn er obligatorisk'),
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string()
        // .email('Email is invalid')
        .required('Email is required'),
      driftssenter: Yup.string().required('Driftssenter is required'),
      role: Yup.string().required('Role is required'),
      password: Yup.string()
        .concat(
          isAddMode ? Yup.string().required('Password is required') : null
        )
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .when('password', (password, schema) => {
          if (password || isAddMode)
            return schema.required('Confirm Password is required');
        })
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    });

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={this.onSubmit}
        innerRef={(formikRef) => (this.formikRef = formikRef)}
      >
        {(formik) => (
          <Form>
            <h1>Hvilken ordning søker du på?</h1>
            <div className="form-row">
              <div className="form-group col">
                <div id="my-radio-group">Velg ordning</div>
                <div role="group" aria-labelledby="my-radio-group">
                  <label style={{ display: 'block' }}>
                    <Field type="radio" name="foretak" value="Veksthus" />
                    Veksthus
                  </label>
                  <label style={{ display: 'block' }}>
                    <Field type="radio" name="foretak" value="Vanningslag" />
                    Vanningslag
                  </label>
                  <ErrorMessage
                    name="foretak"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
              </div>
            </div>
            <h1>{isAddMode ? 'Opprett foretak' : 'Rediger foretak'}</h1>
            <div className="form-row">
              <div className="form-group col-5">
                <label>Navn på foretak</label>
                <Field
                  name="firstName"
                  type="text"
                  className={
                    'form-control' +
                    (formik.errors.firstName && formik.touched.firstName
                      ? ' is-invalid'
                      : '')
                  }
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col-5">
                <label>Adresse</label>
                <Field
                  name="lastName"
                  type="text"
                  className={
                    'form-control' +
                    (formik.errors.lastName && formik.touched.lastName
                      ? ' is-invalid'
                      : '')
                  }
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-7">
                <label>Organisasjonsnummer</label>
                <Field
                  name="email"
                  type="text"
                  className={
                    'form-control' +
                    (formik.errors.email && formik.touched.email
                      ? ' is-invalid'
                      : '')
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col-7">
                <label>Driftssenter</label>
                <Field
                  name="driftssenter"
                  type="text"
                  className={
                    'form-control' +
                    (formik.errors.driftssenter && formik.touched.driftssenter
                      ? ' is-invalid'
                      : '')
                  }
                />
                <ErrorMessage
                  name="driftssenter"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col">
                <label>Role</label>
                <Field
                  name="role"
                  as="select"
                  className={
                    'form-control' +
                    (formik.errors.role && formik.touched.role
                      ? ' is-invalid'
                      : '')
                  }
                >
                  <option value=""></option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            {!isAddMode && (
              <div>
                <h3 className="pt-3">Endre passord</h3>
                <p>La feltet stå tomt for å beholde samme passord</p>
              </div>
            )}
            <div className="form-row">
              <div className="form-group col">
                <label>
                  Password
                  {!isAddMode &&
                    (!this.state.showPassword ? (
                      <span>
                        {' '}
                        -{' '}
                        <a
                          onClick={() =>
                            this.setState({
                              showPassword: !this.state.showPassword,
                            })
                          }
                          className="text-primary"
                        >
                          Show
                        </a>
                      </span>
                    ) : (
                      <span> - {this.state.user.password}</span>
                    ))}
                </label>
                <Field
                  name="password"
                  type="password"
                  className={
                    'form-control' +
                    (formik.errors.password && formik.touched.password
                      ? ' is-invalid'
                      : '')
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col">
                <label>Confirm Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className={
                    'form-control' +
                    (formik.errors.confirmPassword &&
                    formik.touched.confirmPassword
                      ? ' is-invalid'
                      : '')
                  }
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="btn btn-primary"
              >
                {formik.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Save
              </button>
              <Link to={isAddMode ? '.' : '..'} className="btn btn-link">
                Cancel
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export { AddEdit };
