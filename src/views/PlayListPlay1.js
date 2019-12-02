import React from 'react'

import { Query} from "react-apollo"
import  { ARTICLE_QUERY } from '../ApolloQueries'

import PlayArticle from '../components/PlayArticle'
import Error from './Error'

const PlayListPlay1  = ({location, history}) => {

  const { art_id, lang } = location.state

  const backToArticle = () => {
    speechSynthesis.pause()
    speechSynthesis.cancel()
    history.push({
      pathname: `/admin/article`,
      state: { art_id, lang }       
    })
  }

  return (

        <Query query={ARTICLE_QUERY} variables={{ artId: art_id, lang }} >
          {({ loading, error, data }) => {
              if (loading) return <div style={{height:'100vh',backgroundColor:'#F4F3EF'}} > </div>
              if (error) return <Error error={error} />

              const { article } = data

              return (

                <div style={{marginTop:'4em'}}>
                <PlayArticle nextArticle={backToArticle} lang={lang} {...article} history={history} />

                </div>
              )
          }}
        </Query>

    )
  }

export default PlayListPlay1
