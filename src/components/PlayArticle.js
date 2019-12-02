import React,{Component} from "react"
import { Link } from 'react-router-dom'
import axios from 'axios'

import {
  Row,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  Button
} from "reactstrap";

import {langSwitch, splitSentence} from '../util'

import { TRANSLATE_SENTENCE_MUTATION, REMOVE_PLAYLIST_MUTATION } from '../ApolloQueries'

class PlayArticle extends Component{

  state={
    playList:'',
    currSentIdx:0,
    currSent:'',
    playing:false,
    started:false,
    orig_text:'',
    orig_lang:'',
    trans_text:'',
    trans_lang:'',
    transPlaying:false,
    modalVisible:false,
    sents:[],
    lang:'',
    rate:''
  }

  componentDidMount = async () => {

    const { article, lang } = this.props
    
    this.setState({currSentIdx:0})
    
    const sents = splitSentence(article)

    const currSent = sents[0]

    this.setState({currSent,sents,lang,rate:1.0})

  }

  removeFromPlaylist = async () => {
    const token = localStorage.getItem('auth_token')
    const { art_id } = this.props
    await axios({
      url: 'https://us-central1-langolearn.cloudfunctions.net/api',
      method: 'post',
      headers: { 'Authorization': token },
      data: {
          query: REMOVE_PLAYLIST_MUTATION,
          variables: { art_id }
      }
    })
  }

  finishSpeaking = sents => { 
    const { transPlaying, orig_text, orig_lang } = this.state
    if (transPlaying){
      
      this.playTrans(orig_text,orig_lang)
      this.setState({transPlaying:false})

    } else {
      this.nextSent(sents)
    }
  }

  nextSent = () => {
    const { currSentIdx, sents, lang, rate } = this.state
    const newIdx = currSentIdx + 1

    if (newIdx === sents.length){
      this.setState({currSentIdx:0})
      this.removeFromPlaylist()
      this.props.nextArticle()

    } else {

    const currSent = sents[newIdx]

    this.setState({
      currSentIdx: newIdx,
      currSent
    })
    
    this.play(currSent,lang,rate)

    }
  }

  translate = async (lang, originalText) => {
    speechSynthesis.pause()

    const token = localStorage.getItem('auth_token')
    const result = await axios({
      url: 'https://us-central1-langolearn.cloudfunctions.net/api',
      method: 'post',
      headers: { 'Authorization': token },
      data: {
          query: TRANSLATE_SENTENCE_MUTATION,
          variables: { lang, originalText }
      }
    })

    const { orig_text, trans_text, orig_lang, trans_lang } = result.data.data.translateSentence

    this.setState({modalVisible: true, transPlaying: true, orig_text, orig_lang, trans_text, trans_lang})

    this.playTrans(trans_text, trans_lang)

  }

  play = () => {
    const { currSent, lang, rate } = this.state
    const voiceLang = `${lang}-${lang.toUpperCase()}`
    const utterance = new SpeechSynthesisUtterance(currSent)

    utterance.lang = voiceLang
    utterance.rate = rate
    speechSynthesis.speak(utterance)

    this.setState({started:true,playing:true})

    utterance.onend = () => this.finishSpeaking()
    
  }

  playTrans = (text,trans_lang) => { 
    
    const voiceLang = `${trans_lang}-${trans_lang.toUpperCase()}`
    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = voiceLang

    speechSynthesis.speak(utterance)
    speechSynthesis.resume()
    const { lang } = this.props
    this.setState({lang})
    
  }

  pause = () => {
    speechSynthesis.pause()
    this.setState({playing:false})
  }

  resume = () => {
    speechSynthesis.resume()
    this.setState({playing:true})
  }

  changeSpeed(rate){
    speechSynthesis.pause()
    const { currSent, lang } = this.state
    this.setState({rate})
    const utterance = new SpeechSynthesisUtterance(currSent)
    const voiceLang = `${lang}-${lang.toUpperCase()}`
    utterance.lang = voiceLang
    utterance.rate = rate
    speechSynthesis.speak(utterance)
    speechSynthesis.resume()
    utterance.onend = () => this.nextSent()
  }

  stopTranslation = () =>{
    speechSynthesis.cancel()
    this.setState({modalVisible:false})
    this.play()
  }

  toggle = () => {this.setState({modalVisible: !this.state.modalVisible})}

  render(){

    const { currSent, started, rate, playing, orig_text, trans_text, modalVisible } = this.state

    const { art_id, title, lang } = this.props
    
    return(
      <>
      <Modal isOpen={modalVisible} toggle={this.stopTranslation} >
        <ModalHeader toggle={this.stopTranslation}>Translations</ModalHeader>
        <ModalBody>

          <div style={{fontSize:22,color:'green',margin: 20}}>{orig_text}</div> 
          <div style={{fontSize:22,color:'blue',margin: 20}}>{trans_text}</div>

          <Button block color="info" onClick={() => this.stopTranslation()}>
            Close
          </Button>

      </ModalBody>
                 
       </Modal>

      <Container fluid style={{marginTop:50,backgroundColor:'#F4F3EF'}}>
        
          <Row >
            <Col >
            <Link 
              to={{ 
              pathname: '/admin/article', 
              state: {
                art_id: art_id,
                lang
              }
              }}> 
              <div style={{fontSize:18,margin:10,color:'#3A7891'}} >
                {title}
              </div>
             </Link>
          </Col>
            
          </Row>

          <Row style={{height:'70vh'}} >
            <Col style={{marginLeft:10, marginRight:10}}>
         
              <div style={{fontSize:24}}>{currSent}</div>
           
          </Col>
            
          </Row>
        

            <Row >

              <Col style={{marginLeft:10}}>
                <Button block outline={rate===1.0 ? false : true} color="warning" onClick={() => this.changeSpeed(1.0)}  >
                  1X
                </Button>
                </Col>
                
                <Col>
                <Button block style={{}} outline={rate===0.75 ? false : true} color="warning" onClick={() => this.changeSpeed(0.75)} >
                  0.75X
                </Button>
                </Col>

                <Col>
                <Button block style={{}}  outline={rate===0.66 ? false : true} color="warning" onClick={() => this.changeSpeed(0.66)} >
                  0.66X
                </Button>
                </Col>

                <Col style={{marginRight:10}}>
                <Button block outline={rate===0.5 ? false : true} color="warning" onClick={() => this.changeSpeed(0.5)}  >
                  0.5X
                </Button>
                </Col>
             
                </Row>

          <Row >
          <Col style={{marginLeft:10}}>
    
            {started ? 

            <Button  block color={playing ? "danger" : "success"} onClick={() => playing ? this.pause() : this.resume()} title="Pause" >
              {playing ?  <div>Pause</div> :  <div>Play</div>}
            </Button>
              :
            <Button block color="success"  onClick={() => this.play()}  >
              Play
            </Button>
            }
            </Col>

            <Col >
              <Button block color="info" style={{}} onClick={() => this.translate(lang, currSent)}  >
                <div>Translate</div>
              </Button>
            </Col>

            <Col style={{marginRight:10}}>
              <Button block onClick={() => this.props.nextArticle()}  >
                 Next
              </Button>
            </Col>
            
            
            </Row>

            </Container>
          </>
    )
  }

}

export default PlayArticle
