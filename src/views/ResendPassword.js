import React,{Component} from "react";
import { Link } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth'

import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Container
} from "reactstrap";

import bkgd from "assets/img/loginmap1.jpg";

class ResendPassword extends Component {

  state={ 
    email:''
  }

  resendPassword = (emailAddress) => {
    firebase.auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }

  render(){

  const { email} = this.state

  return (
    <Container>
    <div style={{
    height:'100vh',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${bkgd})`}} >

    <div style={{paddingRight:'5%',paddingLeft:'5%',paddingTop:'30%',paddingBottom:'30%'}} >

    <center>
    
    <Card className="card-stats">
    <CardHeader>
      
    </CardHeader>
    <CardBody>

   
    <Row>
    <Col md="12">
      <h5 style={{color:'#3A7891'}}>Langa Learn</h5>
    </Col>
    </Row>
        
    <Row>
    <Col  md="12">
      <h3>Resend Password</h3>
    </Col>
    </Row>

    <Row>
      <Col  md="12">
      <FormGroup>
        <label >
          Email address
        </label>
        <Input onChange={e => this.setState({ email: e.target.value })} placeholder="Email" />
      </FormGroup>

      </Col>
    </Row>

    <Row>
      <Col className="pl-1" md="12">
        <Button onClick={() => this.resendPassword(email)} variant="primary" >
          Reset Password
        </Button>
        </Col>
    </Row>

      <Row>
        <Col>
        <div style={{marginBottom:40}}>
        <Link to="/login"> 
          <h5>Login</h5>  
        </Link>
        </div>
        </Col>
      </Row>
      
      </CardBody>
    </Card>

    </center>
  </div>
</div>
</Container>
  )
}

}

export default ResendPassword
