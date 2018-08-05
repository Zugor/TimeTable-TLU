import React from "react";
import { connect } from "react-redux";

class Notification extends React.Component{
    handleClose(){
        this.setState({hide : true});
    }
    render(){
        var message = this.props.children;
        return (
            <article className={`message is-danger ${!message && 'is-hidden'}`}>
                <div className="message-body">{message}</div>
            </article>
        )
    }
}
function mapStateToProps(state){
    return state;
}
const connectedHeader=connect(mapStateToProps)(Notification);
export { connectedHeader as Notification } 