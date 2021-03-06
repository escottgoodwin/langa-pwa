import React,{Component} from "react";

import {
  Row,
  Col,
  Container,
  Input,
  Button,
  ButtonGroup,
  Alert
} from "reactstrap";

import { Mutation } from "react-apollo"
import { LINK_RECS_QUERY, SINGLE_LINK_MUTATION } from '../ApolloQueries'

import LinkRecs1 from '../components/LinkRecs'

class LinkRecs extends Component{

  state={
    link:'',
    transLang:'',
    error:false,
    errormsg:'',
  }

  onDismiss = () => this.setState({ error: false })

  render(){
    const { link, transLang, error, errormsg } = this.state
    return(

        <div className="content">
        <Container >

        <Row fluid='true'>
          <Col lg="12" md="12" sm="12">


            <Button outline active={transLang==='en' ? true : false} color="success" onClick={() => this.setState({transLang:'en'})}>English</Button>
            <Button outline active={transLang==='fr' ? true :  false} color="success" onClick={() => this.setState({transLang:'fr'})}>French</Button>
            <Button outline active={transLang==='de' ? true : false} color="success" onClick={() => this.setState({transLang:'de'})}>German</Button>
            <Button outline active={transLang==='es' ? true : false} color="success" onClick={() => this.setState({transLang:'es'})}>Spanish</Button>


          </Col>
            
        </Row>

          <Row fluid='true'>
          <Col lg="12" md="12" sm="12">

          <Input onChange={e => this.setState({ link: e.target.value })} placeholder="Link" />
          
          </Col>
            
        </Row>

        <Row>
          <Col md="12">

            <Mutation
              mutation={SINGLE_LINK_MUTATION}
              variables={{ link, transLang }}
              onCompleted={data => this._confirm(data)}
              onError={error => this._error (error)}
              update={(cache, { data: { singleLinkRecommendations } }) => {
                cache.writeQuery({
                  query: LINK_RECS_QUERY,
                  data: { 
                    linkRecommendations: singleLinkRecommendations
                  },
                })
              }
            }
            >
            {mutation => (

              <Button onClick={mutation} color="primary" outline >
                Submit
              </Button>

              )}
          </Mutation>

          <Alert color="danger" isOpen={error} toggle={this.onDismiss}>
              {errormsg}
            </Alert>

          </Col>
        </Row>
       
        <LinkRecs1 lang={transLang} />
        
        </Container>
        </div>
    )
  }

  _confirm = async data => {
    
    const recresp = data.singleLinkRecommendations
    this.setState({recresp})
  }

  _error = async error => {

    const gerrorMessage = error.graphQLErrors.map((err,i) => err.message)
    this.setState({ error: true, errormsg: gerrorMessage})

    error.networkError &&
      this.setState({ error: true, errormsg: error.networkError.message})
}
}

export default LinkRecs
