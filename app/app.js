import React,{ Component } from "react";
import { Router,Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "./store";

import { HomePage } from "./HomePage";
import { PageNotFound } from "./sections";

class Application extends Component{
    constructor(props){
		super(props);
        this.state={
            loading: false,
        }
    }
    componentDidMount(){
        this.setState({loading: true});
    }
    render(){
        const {loading} = this.state;
        if(loading){
            return (
                <Router history={history}>
                    <div>
                    <Switch history ={history}>
                        <Route exact path="/" component={ HomePage } />
                        <Route component={ PageNotFound } />
                    </Switch>
                    </div>
                </Router>
            )
        }else{
            return (<div>can't loading</div>)
        }
        
    }
}
function mapStateToProps(state){
    return state;
}
const connectedApp=connect(mapStateToProps)(Application);
export default connectedApp;