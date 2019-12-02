import React,{Component} from "react";
import { Link } from 'react-router-dom'
import { FaFacebook, FaGooglePlusSquare, FaTwitterSquare,FaAt } from 'react-icons/fa';

import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container
} from "reactstrap";

import fire from '../firebase'

import bkgd from "assets/img/loginmap1.jpg";

import SignUpEmail from '../components/SignUpEmail'
import SignUpGoogle from '../components/SignUpGoogle'
import SignUpTwitter from '../components/SignUpTwitter'
import SignUpFacebook from '../components/SignUpFacebook'

class SignUp extends Component {

  state ={ 
    signIn:'email'
  }

  componentDidMount(){
    const { history } = this.props
    fire.auth().onAuthStateChanged(function(user) {
      if (user) {
        history.push(`/admin/dashboard`)
      } else {
        
      }
    });
  }

  render(){

  const { signIn} = this.state
  return (
    <Container>
    <div style={{
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${bkgd})`}} >

  <div style={{paddingRight:'5%',paddingLeft:'5%',paddingTop:'5%',paddingBottom:'5%'}} >

    <center>
    
    <Card style={{height:'52em'}}>
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
      <h3>Sign Up</h3>
    </Col>
    </Row>

    <Row>
    <Col  xs="3">

      <FaAt style={{color:'#3A7891'}} size={54} onClick={() => this.setState({signIn:'email'})} />        
    
    </Col>

      <Col  xs="3">
        
          <FaGooglePlusSquare style={{color:'#3A7891'}} size={54} onClick={() => this.setState({signIn:'google'})}  />
          
      </Col>
      <Col  xs="3">
      
        <FaTwitterSquare style={{color:'#3A7891'}} size={54} onClick={() => this.setState({signIn:'twitter'})} />
        
      </Col>
      <Col  xs="3">
     
        <FaFacebook style={{color:'#3A7891'}} size={54} onClick={() => this.setState({signIn:'facebook'})} />
       
      </Col>
    </Row>

    <Row>
      <Col  >
        {signIn==='email' &&
         <SignUpEmail history={this.props.history}/>
        }
        {signIn==='google' &&
         <SignUpGoogle history={this.props.history}/>
        }
        {signIn==='twitter' &&
         <SignUpTwitter history={this.props.history}/>
        }
        {signIn==='facebook' &&
         <SignUpFacebook history={this.props.history}/>
        }
      </Col>
    </Row>
      <Row>
        <Col>
        
        <Link to="/login"> 
          <h5>Login</h5>  
        </Link>
        
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

export default SignUp
