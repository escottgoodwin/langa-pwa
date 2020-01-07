import React from "react";
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Row,
  Col,
} from "reactstrap";

import PlaylistButton from './PlaylistButton'

const LinkRecMain = ({ lang, art_id, date, title, playlist }) => 
    <>
    <Row>  
      <Col >
      <div key={art_id}>
        <div>{moment(date).format('MMMM Do YYYY')}</div>
        <div>
          <Link 
              to={{ 
              pathname: '/admin/article', 
              state: {
                art_id: art_id,
                lang,
                playlist
              }
              }}>
            <div style={{color:'#3A7891'}}>{title}</div>
          </Link>
          </div>
        </div>
        </Col>
    </Row>
    <Row>
    <Col >
      <PlaylistButton lang={lang} art_id={art_id} date={date} title={title} playlist={playlist} />
    </Col>
    </Row>
    <hr/>
    </>              

export default LinkRecMain