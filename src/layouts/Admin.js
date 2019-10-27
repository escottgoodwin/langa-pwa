import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import fire from '../firebase'

import routes from "routes.js";
import Article from "../views/Article";
import ArtRecDate from "views/ArtRecDate";

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "green",
      activeColor: "info"
    };
    this.mainPanel = React.createRef();
  }


  notSignedIn = () => {
    this.props.history.push(`/login`)
   }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    const { name } = JSON.parse(localStorage.getItem('user'))
    this.setState({
      name
    })
    fire.auth().onAuthStateChanged(user =>  {

      if (user) {
          this.setState({
            userName:user.displayName,
          })
      } else {
        this.setState({name:'No user'})
        this.notSignedIn()
      }
    });
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = color => {
    this.setState({ activeColor: color });
  };
  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };
  render() {
    return (
      <div className="wrapper">
        <Sidebar
          userName={this.state.name}
          {...this.props}
          routes={routes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
        />
        <div className="main-panel" ref={this.mainPanel}>
          <DemoNavbar {...this.props} />
          <Switch>
            {routes.map((prop, key) => {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                />
              );
            })}

            <Route
              path='/admin/article'
              component={Article}
              name='Article'
            />

            <Route
              path='/admin/article'
              component={ArtRecDate}
              name='Recommendation History'
            />

          </Switch>
          <Footer fluid />
        </div>

      </div>
    );
  }
}

export default Dashboard;
