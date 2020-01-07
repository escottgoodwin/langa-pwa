import React,{Component} from "react";
import DatePicker from 'react-date-picker';
import Flag from 'react-world-flags'
import moment from 'moment'
import ArtRecsDate from '../components/ArtRecsDate'
import {
  Row,
  Col,
  Container,
} from "reactstrap";

class ArtRecDate extends Component{
  state={
    date: new Date(),
    searchDate: moment().format('YYYY-MM-DD'),
    lang:'',
    language:'',
    flag:'',
    fr:false,
    de:false,
    es:false,
  }

onChangeDate = date => {
    const searchDate = moment(date).format('YYYY-MM-DD')
    this.setState({ date, searchDate })
}

onChangeLang = (lang, language, flag) => {
  this.setState({ lang, language, flag })
  if (lang === 'en'){
    this.setState({ en:true, es:false, fr:false, de:false })
  }

  if (lang === 'es'){
    this.setState({ en:false, es:true, fr:false, de:false })
  }

  if (lang === 'fr'){
    this.setState({ en:false, es:false, fr:true, de:false })
  }

  if (lang === 'de'){
    this.setState({ en:false, es:false, fr:false, de:true })
  }
}
  
  render(){
    const { lang, flag, language, date, searchDate } = this.state
    const { en_rec, de_rec, es_rec, fr_rec } = JSON.parse(localStorage.getItem('user'))
    console.log(searchDate)
    return(
      <div className="content">
        <Container >
        
            <Row>
            
              <Col>
              <center>
              {en_rec &&
                <Flag style={{margin:5}} code="gb" height="36" onClick={() => this.onChangeLang('en','English',"gb")}/>
              
              }
              {fr_rec &&
              <Flag style={{margin:5}} code="fr" height="36" onClick={() => this.onChangeLang('fr','French',"fr")}/>
              
              }
              {de_rec &&
                <Flag style={{margin:5}} code="de" height="36" onClick={() => this.onChangeLang('de','German',"de")}/>
              
              }
              {es_rec &&
                <Flag style={{margin:5}} code="es"height="36" onClick={() => this.onChangeLang('es','Spanish',"es")}/>
              }

               
             </center>
              </Col>
            </Row>

            <Row>
            
          <Col >
            <center> 
              
              <DatePicker
                onChange={this.onChangeDate}
                value={date}
                required
              />
            </center>   
            </Col>
            </Row>
  
 
          <Row>
          <Col md="8">
              {lang &&
                <ArtRecsDate lang={lang} searchDate={searchDate} flag={flag} language={language}/>
              }
             
          </Col>
          </Row>
            
         </Container>
      </div>  
      )
    }
  }

export default ArtRecDate