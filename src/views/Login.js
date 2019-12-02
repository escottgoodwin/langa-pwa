import React,{Component} from "react";
import firebase from 'firebase/app';
import 'firebase/auth'
import axios from 'axios'
import { Link } from 'react-router-dom'
// nodejs library to set properties for components
import { FaFacebook, FaGooglePlusSquare, FaTwitterSquare } from 'react-icons/fa';
// @material-ui/core components

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

import fire from '../firebase'

import bkgd from "assets/img/loginmap1.jpg";
import logo from "assets/img/langalogo.png";

import { LOGIN_MUTATION } from '../ApolloQueries'

var google = new firebase.auth.GoogleAuthProvider();

var facebook = new firebase.auth.FacebookAuthProvider();

var twitter = new firebase.auth.TwitterAuthProvider();

const processLogin = (uid,props) => {
  localStorage.setItem('uid', uid)
  axios({
    url: process.env.REACT_APP_GRAPHQL_SERVER,
    method: 'post',
    data: {
        query: LOGIN_MUTATION,
        variables: { uid }
    }
  }).then((result) => {
      const { token, user } = result.data.data.login

      localStorage.setItem('auth_token',token) 
      localStorage.setItem('user',JSON.stringify(user))
  
      props.history.push({
        pathname: `/admin/dashboard`,
        state: { lang: '' }       
      })
  })

}

class Login extends Component {

  state = {
    name:'',
    email:'',
    password:'',
    showPassword: false,
    showError:false,
    errorMessage:'',
  }

  componentDidMount(){
    const { history } = this.props
    fire.auth().onAuthStateChanged(function(user) {
      if (user) {
        history.push({
          pathname: `/admin/dashboard`,
          state: { lang: '' }       
        })
      } else {
        
      }
    });
  }

  googleSignIn = (props) => {

    fire.auth().signInWithPopup(google).then(function(result) {
      processLogin(result.user.uid,props)
    }).catch((error) => {
      var errorMessage = error.message;
      this.setState({errorMessage,showError:true})
    })
  }

  facebookSignIn = (props) => {

    fire.auth().signInWithPopup(facebook).then(function(result) {
      processLogin(result.user.uid,props)
    }).catch((error) => {
      var errorMessage = error.message;
      this.setState({errorMessage,showError:true})
    })

  }

  twitterSignIn = (props) => {

    fire.auth().signInWithPopup(twitter).then(function(result) {
      processLogin(result.user.uid,props)
    }).catch((error) => {
      var errorMessage = error.message;
      this.setState({errorMessage,showError:true})
    })
  }

  emailSignIn = (props) => {
    const { email, password } = this.state

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(result) {
      processLogin(result.user.uid,props)
    }).catch((error) => {
      var errorMessage = error.message;
      this.setState({errorMessage,showError:true})
    })
  }

  onDismiss = () => this.setState({showError:false})

  render(){

  return (

    <div style={{
      height:'100vh',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${bkgd})`}} >

  <div style={{paddingRight:'5%',paddingLeft:'5%',paddingTop:'5%',paddingBottom:'5%'}} >

    <center>
    <div style={{margin:20}}>

    <Card className="card-stats">
    
    <CardBody>

    <Row>
    <Col md="12">

      <img src={logo} alt="logo" />

    </Col>
    </Row>

      <hr />

        <Row>
        <Col  xs="4" sm="4" md="4" lg="4">
            <div onClick={() => this.googleSignIn(this.props)}> 
             <FaGooglePlusSquare size={54} style={{color:'#3A7891'}}   />
            </div>
          </Col>
          <Col  xs="4" sm="4" md="4" lg="4">
          <div onClick={() => this.twitterSignIn(this.props)} > 
            <FaTwitterSquare size={54} style={{color:'#3A7891'}}  />
          </div>
          </Col>
          <Col  xs="4" sm="4" md="4" lg="4">
          <div onClick={() => this.facebookSignIn(this.props)}> 
            <FaFacebook size={54} style={{color:'#3A7891'}}   />
          </div>
          </Col>
        </Row>
        <div style={{margin:50}}>
          
            <Row>
                <Col className="pl-1" md="12">
                <Form>
                  <FormGroup>
                    <label >
                      Email address
                    </label>
                    <Input onChange={e => this.setState({ email: e.target.value })} placeholder="Email" type="email" />
                  </FormGroup>
                  </Form>
                </Col>
              </Row>
              <Row>
              <Col className="pl-1" md="12">
              <Form>
                <FormGroup controlid="formBasicPassword">
                  <label >
                    Password
                  </label>
                  <Input onChange={e => this.setState({ password: e.target.value })} placeholder="Password" type="password" />
                </FormGroup>
              </Form>
              </Col>
              </Row>
              <Row>
                <Col className="pl-1" md="12">
                  <Button onClick={() => this.emailSignIn(this.props)} style={{backgroundColor:'#3A7891'}} >
                    Login
                  </Button>
                  </Col>
              </Row>
         
              <hr />
              <Row>
                <Col>
                  <div style={{marginTop:10}}>
                    <Link to="/sign_up"> 
                      <h6 style={{color:'#3A7891'}}>Sign Up</h6>
                    </Link>
                  </div>
                </Col>

                <Col>
                  <div style={{marginTop:10}}>
                    <Link to="/resend_password"> 
                      <h6 style={{color:'#3A7891'}}> Reset Password </h6>  
                    </Link>
                  </div>
                </Col>

              </Row>

                </div>
              </CardBody>
            </Card>

              <div style={{height:50}}>
        
            </div>
          </div>
        </center>
      </div>
    </div>

  );
}

};

export default Login;
