import React from "react";
import { sortDate } from '../util'

import {
  Row,
  Col,
} from "reactstrap";

import { Query } from "react-apollo"
import { ARTICLE_REC_ALL_QUERY } from '../ApolloQueries'

import LinkRecMain from './LinkRecMain'

const ArtRecs = ({location}) => {
    const { lang } = location.state
    return(

      <Query  query={ARTICLE_REC_ALL_QUERY}
              variables={{ lang }}
              fetchPolicy={'cache-and-network'}  >
            {({ loading, error, data }) => {
            if (loading) return <div style={{height:'100vh',backgroundColor:'#F4F3EF'}} > </div>
            if (error) return <div>{JSON.stringify(error)}</div>

            const { articleRecommendationsAll } = data
            const artRecsSorted = sortDate(articleRecommendationsAll)

            return (

              <Row >
                <Col md="12">
                <table>
                { artRecsSorted.length>0 &&
                  artRecsSorted.map((a,i) => 
                    <LinkRecMain key={i} {...a} />
                  )
                }
                </table>
                </Col>
              </Row>
            )
          }}
       </Query>

      )
    }


export default ArtRecs