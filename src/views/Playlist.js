import React from "react";
import { Link } from 'react-router-dom'
import { sortDate } from '../util'

import {
  Row,
  Col,
  Container,
  Button
} from "reactstrap"

import { Query } from "react-apollo"
import { PLAYLIST_QUERY } from '../ApolloQueries'

import LinkRecPlaylist from '../components/LinkRecPlaylist'
import Error from './Error'

const PlayList = () => {

    return(

      <Query  query={PLAYLIST_QUERY}
                    fetchPolicy={'cache-and-network'}
                  >
                {({ loading, error, data }) => {
                if (loading) return <div style={{height:'100vh',backgroundColor:'#F4F3EF'}} > </div>
                if (error) return <Error {...error} />

                const { playList } = data

                const playListSorted = sortDate(playList )
    
                return (

      
          <Container style={{marginTop:50}}a>

            <Row >

              <Col >
                <Link 
                    to={{ 
                    pathname: '/admin/play_playlist', 
                    state: {
                      playList
                    }
                    }}>   
                    <Button block color="success" > 
                      Play
                    </Button>
                </Link>

              </Col>
            </Row>
            <hr />
            <Row style={{marginTop:10}}>
              <Col md="12" >
                { playListSorted.map((r) => <LinkRecPlaylist key={r.art_id} {...r} />) }
              </Col>
            </Row>

      </Container>
        )
      }}
    </Query>
    )
  }
  
export default PlayList
