import React from 'react'

import { Query} from "react-apollo"
import  { ARTICLE_QUERY } from '../ApolloQueries'

import PlayArticle from '../components/PlayArticle'
import Error from './Error'

const PlayListPlay = ({location, history}) => {

  const { playList } = location.state
  const { art_id, lang } = playList[0]

  const nextArticle = () => {

    speechSynthesis.cancel()
    const { playList } = location.state

    playList.shift()
    if(playList.length>0){
      history.push({
        pathname: `/admin/play_playlist`,
        state: { playList }       
      })
    } else { 
      history.push({
        pathname: `/dashboard`    
      })
    }
    
  }
    return (

        <Query query={ARTICLE_QUERY} variables={{ artId: art_id, lang }} >
          {({ loading, error, data }) => {
              if (loading) return <div style={{height:'100vh',backgroundColor:'#F4F3EF'}} > </div>
              if (error) return <Error {...error} />

              const { article } = data
          return (
            
            <PlayArticle nextArticle={nextArticle} lang={lang} {...article}  />

          )
        }}
      </Query>

    )
  }

export default PlayListPlay
