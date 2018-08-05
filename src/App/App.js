import React,{ Component } from "react";
import { Router,Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import { createBrowserHistory } from 'history';

import { HomePage } from "../HomePage";
import { PageNotFound } from "../sections";

import { history } from "../store";
class App extends Component{
    constructor(props){
        super(props);
        
        const { dispatch }=this.props;
        this.state={
            loading: false,
        }
    }
    componentDidMount(){
        this.setState({
            loading: true
        });
    }
    render(){
        const {loading} = this.state;
        if(loading){
            return (
                <Router history={history}>
                    <div>
                    <Switch history ={ history  }>
                        <Route exact path="/" component={ HomePage } />
                        <Route component={PageNotFound} />
                    </Switch>

                    </div>
                </Router>
            )
        }else{
            return (<div></div>)
        }
        
    }
}
function mapStateToProps(state){
    return state;
}
const connectedApp=connect(mapStateToProps)(App);
export default connectedApp;