import React from "react";
import { connect } from "react-redux";
import { Header, Footer } from "../sections";
import { MainLeft, MainRight } from "./index";

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
            <div>
                <div className="container">
                    <Header/>
                    <main>
                        <div className="columns">
                            <div id="main-left" className="column is-one-third">
                                <MainLeft/>
                            </div>
                            <div id="main-right" className="column">
                                <MainRight/>
                            </div>
                        </div>
                    </main>
                </div>
                <Footer/>
            </div>
        )
        
    }
}
function mapStateToProps(state){     
    return state;
}
const connectedHomePage=connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage } 