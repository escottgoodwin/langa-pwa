import React,{Component} from "react";
import moment from 'moment'
import axios from 'axios'
import { langSwitch } from '../util'
import Flag from 'react-world-flags'
import { Link } from 'react-router-dom'

import {
  Row,
  Col,
  Container,
  Button,
  ButtonGroup,
  Input,
  Alert,
  InputGroupAddon,
  InputGroup,
  Modal, 
  ModalHeader, 
  ModalBody
} from "reactstrap";

import { Query, Mutation } from "react-apollo"
import { ARTICLE_QUERY, TRANSLATION_MUTATION, ADD_PLAYLIST_MUTATION, REMOVE_PLAYLIST_MUTATION } from '../ApolloQueries'

import Error from './Error'

var Highlight = require('react-highlighter');

function endReading(self){
  self.setState({playing:false})
  self.setState({paused:false})
  // update recs as played
  speechSynthesis.cancel()
}

class Article extends Component{

  state={
    playing:false,
    paused:false,
    rate:1,
    originalText:'',
    hoverTrans:'',
    flag:'',
    language:'',
    message:'',
    alert:false,
    errorOpen:false,
    playlist:false,
    orig_text:'',
    trans_text:'',
    modal:false,
    transForm:true
  }

  componentDidMount(){
    const { lang, playlist } = this.props.location.state
    const { language, flag } = langSwitch(lang)
    this.setState({playlist, language, flag})
  }

  translateSel = async (lang,artId) => {
    const selecttext = window.getSelection().toString()
    this.setState({orig_text:'', trans_text:''})
    const token = localStorage.getItem('auth_token')
    await axios({
      url: process.env.REACT_APP_GRAPHQL_SERVER,
      method: 'post',
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      data: {
          query: TRANSLATION_MUTATION,
          variables: { 
            originalText: selecttext,
            artId,
            lang
          }
      }
    })
  }

  readArticles = (article,lang,rate) => {
      const voiceLang = `${lang}-${lang.toUpperCase()}`
      const utterance = new SpeechSynthesisUtterance(article)

      utterance.lang = voiceLang
      utterance.rate = rate
      speechSynthesis.speak(utterance)
      var self = this
      utterance.onend = function(event) {
        endReading(self)
        speechSynthesis.cancel()
      }

      this.setState({playing:true})
    }

    pauseReading(){
      speechSynthesis.pause()
      this.setState({paused:true})
    }
    
    resumeReading(){
      speechSynthesis.resume()
      this.setState({paused:false})
    }

    changeSpeed(article,lang,rate){
      speechSynthesis.cancel()
      this.setState({rate})
      this.readArticles(article,lang,rate)
    }

    componentWillUnmount(){
      speechSynthesis.cancel()
    }

    selectText = originalText => {

      this.setState({
        orig_text:'', 
        trans_text:'', 
        originalText,
        transForm:true
      })
    }

    toggle = () => {this.setState({modal:!this.state.modal})}

    
  render(){
    const { art_id, lang } = this.props.location.state
    const { playlist, flag, language, paused, rate, playing, transForm, originalText, modal, orig_text, trans_text, alert, message, errorOpen } = this.state
    return(
      <>
        <div style={{marginTop:'5em'}}>

        <Query query={ARTICLE_QUERY} variables={{ artId: art_id, lang }} >
            {({ loading, error, data }) => {
                if (loading) return <div style={{height:'100vh',backgroundColor:'#F4F3EF'}} > </div>
                if (error) return <Error {...error} />

                const { article, title, link, date, translations } = data.article
              
            return (

            <Container fluid>

              <Row >
                <Col xs={10}>
                  <div>{moment(date).format('MMMM Do YYYY')} <Flag code={lang} height="12" /> </div>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <div style={{color:'#3A7891',fontSize:18}}>
                      {title}
                    </div>  
                  </a>
                </Col>

                <Col xs={2} >

                  {playlist ? 

                    <Mutation
                      mutation={REMOVE_PLAYLIST_MUTATION}
                      variables={{ art_id }}
                      onError={error => this._error(error)}
                      onCompleted={data => this._confirm(data.removeFromPlaylist.message)}
                      >
                      {mutation => (
                        <Button onClick={mutation} size="sm" color="success">PL</Button>
                      )}
                    </Mutation>

                    :

                    <Mutation
                      mutation={ADD_PLAYLIST_MUTATION}
                      variables={{ art_id }}
                      onError={error => this._error(error)}
                      onCompleted={data => this._confirm(data.addToPlaylist.message)}
                      >
                      {mutation => (
                        <Button onClick={mutation}  size="sm" outline color="success">PL</Button>
                      )}
                    </Mutation>
                    }

                </Col>
 
              </Row>

              <Row fluid='true'>
              <Col style={{height:'7em'}} lg="2" md="2" sm="2">

              {errorOpen &&
                
                <Alert color="danger" style={{fontSize:18}}>
                  {message}
                </Alert>
              }
               
              {orig_text.length>0 &&
                
                <Alert color="success" style={{fontSize:18}}>
                  <b>{orig_text}</b> means <b>{trans_text}</b>
                </Alert>
              }
              
              {transForm &&
                <>
                  <Input style={{height:40}} onChange={e => this.setState({ originalText: e.target.value })} value={originalText} placeholder="Highlight Text"/>

                  <div>
                  <Mutation
                    mutation={TRANSLATION_MUTATION}
                    variables={{ 
                      originalText,
                      artId: art_id,
                      lang
                    }}
                    onError={error => this._error (error)}
                    onCompleted={data => this._trans(data)}
                    refetchQueries={() => { return [{
                      query: ARTICLE_QUERY,
                      variables: { artId: art_id, lang }}]
                    }}
                  >
                  {mutation => (

                    <Button block size="small" color="info" onClick={mutation}>
                      Translate
                    </Button>
                    )}
                </Mutation>
                 
                </div>
              </>
            }
               
            </Col>

          </Row>

          <Row style={{height:'60vh',overflow:"auto"}} >
            <Col>
                  
                  <div  onMouseUp={() => this.selectText(window.getSelection().toString())}>
                    <h5>
                      {article}
                    </h5>
                  </div>
  
                </Col>

                <Modal isOpen={modal} toggle={this.toggle} >
                  <ModalHeader toggle={this.toggle}>Translations</ModalHeader>
                  <ModalBody>
                  <div >
                    {translations.map((t,i) => 
                    <div>
                       <div style={{fontSize:18,color:"#17a2b8"}}>{t.orig_text}</div>
                      <div style={{fontSize:18,color:"#28a745"}}>{t.trans_text}</div>
                      <hr />
                    </div>
                    )}
                  </div>
                    
                  </ModalBody>
                 
                </Modal>

          </Row>

        <Row >

          <Col xs="6">
            <Link 
                to={{ 
                pathname: '/admin/play_article', 
                state: {
                  art_id,
                  lang
                }
                }}>   
                <Button block color="success" > 
                  Play
                </Button>
            </Link>

          </Col>

          <Col xs="6">
            {
              translations.length>0 ?
              <Button block color="info" onClick={() => this.toggle()}> 
                Translations
              </Button>
              :
              <Button block color="info" disabled> 
                Translations
              </Button>
            }   
          </Col>

        </Row>
        
      </Container>
      )
    }}
  </Query>
          
   </div>
        
    </>
    )
  }

  _error = async error => {
    this.setState({message: error.message, errorOpen:true, transForm:false})
  }

  _confirm = async message => {
    this.setState({playlist: !this.state.playlist})
  }

  _trans = async data => {
    const { orig_text, trans_text } = data.translation
    this.setState({orig_text, trans_text, errorOpen:false, transForm:false})
  }

}

export default Article
