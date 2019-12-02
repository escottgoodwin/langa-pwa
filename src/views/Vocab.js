import React,{Component} from "react";

import {
  Container,
  Row,
  Col,
  Toast, 
  ToastBody,
  ToastHeader 
} from "reactstrap";

import VocabTest from '../components/VocabTest'


import { Query } from "react-apollo"
import { VOCAB_QUERY } from '../ApolloQueries'

class Vocab extends Component{

  render(){
          
    return(

      <Query query={VOCAB_QUERY} 
            fetchPolicy={"network-only"}>
        {({ loading, error, data }) => {
            if (loading) return <div style={{height:'100vh',backgroundColor:'#F4F3EF'}} > </div>
            if (error) return <div>{JSON.stringify(error)}</div>

            const { translations } = data

            return (                
              <>
              <div className="content">
                
                
                <Container >

                <Row >
                  <Col >
                  <div style={{fontSize:18}}>Translate foreign words into your native language.</div>
                  </Col>
                </Row>
                <hr/>
                <Row >
                  <Col >
                    { translations.length>0 && <VocabTest vocab={translations} /> } 
                  </Col>
                </Row>

              </Container>
              
                
               
              </div>
              
              </>
            )
          }}
        </Query>
    )
  }

}

export default Vocab
