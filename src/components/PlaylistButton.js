import React from "react";

import {
  Button
} from "reactstrap";

import { Mutation } from "react-apollo"
import { ADD_PLAYLIST_MUTATION, REMOVE_PLAYLIST_MUTATION, ARTICLE_REC_ALL_QUERY } from '../ApolloQueries'

const PlaylistButton = ({ lang, art_id, playlist }) => 
      <>
      {playlist ? 

        <Mutation
          mutation={REMOVE_PLAYLIST_MUTATION}
          variables={{ art_id }}
          refetchQueries={() => {
            return [{
              query: ARTICLE_REC_ALL_QUERY,
              variables:{ lang }
             }];
          }}
          >
          {mutation => (
            <Button onClick={mutation} block color="success">Playlist</Button>
          )}
        </Mutation>
         
         :

         <Mutation
          mutation={ADD_PLAYLIST_MUTATION}
          variables={{ art_id }}
          refetchQueries={() => {
            return [{
              query: ARTICLE_REC_ALL_QUERY,
              variables:{ lang }
             }];
          }}
          >
          {mutation => (
            <Button onClick={mutation} block outline color="success">Playlist</Button>
          )}
        </Mutation>
      }
     
    </>              

export default PlaylistButton