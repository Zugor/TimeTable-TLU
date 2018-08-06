import React from "react";

class LoadingPage extends React.Component{
    render(){
        var {state} = this.props;
        return (
        <div className={`pageloader${Boolean(state) ? ' is-active' : ''}`}><span className="title">Đang tải...</span></div>
        ) 
    }
}
export { LoadingPage } 