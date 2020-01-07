import React from "react";
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Row,
  Col,
  Button
} from "reactstrap";

import { Mutation } from "react-apollo"
import { ADD_PLAYLIST_MUTATION, REMOVE_PLAYLIST_MUTATION, ARTICLE_REC_DATE_QUERY } from '../ApolloQueries'

const LinkRecHistory = ({ lang, art_id, date, title, playlist, searchDate }) => 
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
      <Col style={{alignItems:'start'}} md="1">
      {playlist ? 

        <Mutation
          mutation={REMOVE_PLAYLIST_MUTATION}
          variables={{ art_id }}
          refetchQueries={() => {
            return [{
              query: ARTICLE_REC_DATE_QUERY,
              variables: { lang, date: searchDate },
              fetchPolicy: 'cache-and-network'
            }];
          }}
          >
          {mutation => (
            <Button block onClick={mutation} size="sm" color="success">Playlist</Button>
          )}
        </Mutation>
         
         :

         <Mutation
          mutation={ADD_PLAYLIST_MUTATION}
          variables={{ art_id }}
          refetchQueries={() => {
            return [{
              query: ARTICLE_REC_DATE_QUERY,
              variables: { lang, date: searchDate },
              fetchPolicy: 'cache-and-network'
            }];
          }}
          >
          {mutation => (
            <Button onClick={mutation} size="sm" block outline color="success">Playlist</Button>
          )}
        </Mutation>
      }
      </Col>
    </Row>
    <hr />
    </>                 

export default LinkRecHistory