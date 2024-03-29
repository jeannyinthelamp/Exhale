import React from 'react';

import styles from '../App.css';

import firebase from '../../firebase';

import md5 from 'md5';

import { Grid, Form, Segment, Button, Header, Message } from 'semantic-ui-react';

import { Link } from "react-router-dom"



class Register extends React.Component {

  state = {

    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  doSignOut = () => firebase.auth().signOut();


  isFormValid = () => {
    let errors = [];
    let error;


    if(this.isFormEmpty(this.state)){
      error = { message: 'Fill in all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;

    } else if (!this.isPasswordValid(this.state)){
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });

    } else {
      //form valid
      return true;
    }

  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if(password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation){
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !password.length || !passwordConfirmation.length || !email.length;
  };


  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };


  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()){
      this.setState({ errors: [], loading: true});

        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(createdUser => {
            console.log(createdUser);
            //this.setState({ loading: false });
            createdUser.user.updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            })

            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved');
              });
            })
            .catch(err => {
              console.error(err);
              this.setState({ errors: [].concat(err), loading: false });
            })
          })
          .catch(err => {
            this.setState({ errors: [].concat(err), loading: false });
            console.error(err);
          })
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)
  )
  ? "error"
  : ""
};

  render() {
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style= {{ maxWidth: 450 }}>
        <i className="huge user circle outline icon"></i>

          <Form  onSubmit={this.handleSubmit} size="large" className="rform">
            <Segment stacked>
              <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="Username"
              onChange={this.handleChange} value={username}

            type="text"
            />

              <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email"
              onChange={this.handleChange} value={email} className={this.handleInputError(errors, "email")}
              type="email" />

              <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="Password"
              onChange={this.handleChange} value={password} className={this.handleInputError(errors, "password")} type="password" />

              <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation"
              onChange={this.handleChange} value={passwordConfirmation} className={this.handleInputError(errors, "password")} type="password" />

              <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size="large">Submit</Button>


              <Message>Already a user? <Link to="/login" >Login</Link> </Message>

            </Segment>

          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
        </Grid.Column>

      </Grid>
    )
  }
}

export default Register;
