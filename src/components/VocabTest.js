import React,{Component} from "react"
import { Link } from 'react-router-dom'
import Flag from 'react-world-flags'
import { FaLongArrowAltRight } from 'react-icons/fa';

import {
  Row,
  Col,
  Input,
  Button,
  Alert
} from "reactstrap";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class VocabTest extends Component{

  state={
    guess:'',
    feedback:false,
    newQuestion:'',
    newAnswer:'', 
    curQuestion:'',
    curAnswer:'',
    correct:false,
    vocab:[],
    language:'',
    native_lang:'',
    native_flag:'',
    trans_flag:'',
    art_id:'',
    answer_id:'',
    trans_lang:'',
    article_lang:'',
    answereds:[]
  }

  langSwitch = (native_lang) => {
    if (native_lang === 'en'){
      return {language:'English',flag_lang:'gb'}
    }
    if (native_lang === 'es'){
      return {language:'Spanish',flag_lang:native_lang}
    }
    if (native_lang === 'fr'){
      return {language:'French',flag_lang:native_lang}
    }
    if (native_lang === 'de'){
      return {language:'German',flag_lang:native_lang}
    }
  }

  componentDidMount(){
    const { vocab } = this.props
    this.setState({vocab})
    const rnd = getRandomInt(vocab.length)
    const newQuestion = vocab[rnd]
    this.setState({newQuestion:newQuestion.orig_text, newAnswer:newQuestion.trans_text,trans_lang: newQuestion.orig_lang,art_id:newQuestion.art_id})
    const {native_lang} = JSON.parse(localStorage.getItem('user'))

    const { language, flag_lang } = this.langSwitch(native_lang)
    const orig_lang = this.langSwitch(newQuestion['orig_lang'])

    this.setState({language, native_flag: flag_lang, native_lang, trans_flag: orig_lang.flag_lang, article_lang: newQuestion.orig_text})

  }

  resetVocab = (answer) => {
    const { vocab } = this.state
    if (vocab.length>1){
      return vocab.filter(v => v.trans_text!==answer)
    } else { 
      return this.props.vocab
    }
  }

  checkVocab = (question, answer, guess, art_id, trans_lang, answereds) => {
    this.setState({feedback:true, curAnswer: answer, curQuestion: question})

    if (answer.toLowerCase()===guess.toLowerCase()){
      const answered = {ansCorrect:true, answered:question, art_id: art_id, art_lang: trans_lang}

      answereds.unshift(answered)
      
      this.setState({correct:true, feedbackColor:'success', answereds})

      setTimeout(
        function() {
          this.setState({feedback:false, answer:''})
        }.bind(this),
        3000
      )

    } else {

      const answered = {ansCorrect:false, answered:question, art_id: art_id, art_lang: trans_lang} 
      answereds.unshift(answered)

      this.setState({correct:false, feedbackColor:'danger', answereds})
      
      setTimeout(
        function() {
          this.setState({feedback:false, answer:''})
        }.bind(this),
        3000
      )

    }

    const newVocab = this.resetVocab(answer)
    
    this.setState({vocab: newVocab})
    const rnd = getRandomInt(newVocab.length)
    const newQuestion = newVocab[rnd]

    const { flag_lang } = this.langSwitch(newQuestion['orig_lang'])

    this.setState({
        newQuestion: newQuestion['orig_text'], 
        newAnswer: newQuestion['trans_text'], 
        trans_lang: newQuestion['orig_lang'], 
        trans_flag: flag_lang,
        art_id: newQuestion['art_id'], 
        article_id: art_id,
        article_lang: trans_lang,
        guess:''
      })
  } 


  toggle = () => this.setState({correct:false, feedback:false, answer:''})

  render(){

    const { 
      guess,
      feedback,
      newQuestion,
      newAnswer, 
      curQuestion,
      curAnswer, 
      correct,
      language,
      art_id,
      trans_flag,
      native_flag,
      trans_lang,
      answereds
      } = this.state

    return(

      <>
  
          <Row >
            <Col >

              <Flag code={trans_flag} height="48" />  
              </Col>

              <Col >
                <FaLongArrowAltRight style={{fontSize:56}}/>
              </Col >
              <Col> 
              
              <Flag code={native_flag} height="48" />
            
           </Col>
          </Row>

          <Row >
            <Col >

              <h5 style={{marginTop:20,marginBottom:20}}>What does <span style={{color:"#17a2b8"}}> <b>{newQuestion}</b> </span> mean in {language}?</h5>
 
            </Col>
          </Row>

          <Row fluid='true'>
          <Col >
    
            <Input onChange={e => this.setState({ guess: e.target.value })} value={guess} placeholder="Translation" />
          
          </Col>
          </Row>
       
          <Row fluid='true'>
          <Col >
            <Button block onClick={() => this.checkVocab(newQuestion, newAnswer, guess, art_id, trans_lang,answereds)} color="primary" outline >
              Submit
            </Button>
          </Col>
          </Row>

        <Row>
          <Col >
             
              <Alert color={correct ? 'success':'danger'} isOpen={feedback} toggle={this.toggle}>
                
                <div style={{fontSize:16}}>Your answer was {correct ? 'correct' : 'incorrect' }.</div>
                <div style={{fontSize:16}}><b>{curQuestion}</b> means <b>{curAnswer}</b>.</div>
            
             </Alert>
 
          </Col>

        </Row>

        <Row>

        <Col>
          <h5>Answers</h5>
          {
            answereds.map(a => 
              <Alert color={a.ansCorrect ? 'success':'danger'}>
                <div style={{fontSize:18}}>{a.answered}</div>
                <Link 
                  to={{ 
                  pathname: '/admin/article', 
                  state: {
                    art_id: a.art_id,
                    lang: a.art_lang
                  }
                  }}>
                    <div style={{color:'#3A7891'}}>Source Article</div>
              </Link>
              </Alert>
              )
          }
        </Col>
        </Row>


      </>
    )
  }

}

export default VocabTest
