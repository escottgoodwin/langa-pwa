import React,{Component} from "react";
import {
  Row,
  Col,
} from "reactstrap";

import { Query } from "react-apollo"
import { ARTICLE_REC_QUERY } from '../ApolloQueries'

import Cluster from './Cluster'

class ArtRecs extends Component{

  render(){
    const { lang, flag, language } = this.props
    return(

      <Query  query={ARTICLE_REC_QUERY}
              fetchPolicy={'cache-and-network'}
              variables={{ lang }}  >
            {({ loading, error, data }) => {
            if (loading) return <div style={{height:'100vh',backgroundColor:'#F4F3EF'}} > </div>
            if (error) return <div>{JSON.stringify(error)}</div>

            const { articleRecommendations } = data
 
            return (

              <Row >
                <Col md="12">
                { articleRecommendations.length>0 &&
                <>
                  <div >
                    <h5> {language} Recommendations</h5>
                  </div>

                  {
                    articleRecommendations.map((r,i) => 
                      <Cluster key={i} lang={lang} index={i} flag={flag} {...r}/>
                     )
                  }
                 
                  </>
                  }
                </Col>
              </Row>
            )
          }}
       </Query>

      )
    }
  }

export default ArtRecs