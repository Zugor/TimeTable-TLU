import React from "react";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";
class HomePage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            login: true,
            register: false,
            className: 'jsHomepage homepageLogin',
            loading: false,
        }
    }
    render(){
        return (
            <div id="wrapper">
                <div className="tw3-homepage--abstract tw3-homepage--abstract--desktop">   
                </div>
            </div>
        )
        
    }
}
function mapStateToProps(state){     
    return state;
}
const connectedHomePage=connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage } 