import React from "react";
import { connect } from "react-redux";

class Footer extends React.Component{
    constructor(props){
        super(props);
     
    }
    render(){
       return (
<footer className="footer">
    <div className="container">
        <div className="content has-text-centered">
            <p>
            Phát triển bởi <a href="https://jgthms.com">Bùi Tuấn Anh</a> - Sinh viên Khoa Toán Tin K28 - Trường đại học Thăng Long
            </p>
        </div>
    </div>
</footer>
        ) 
    }
}
function mapStateToProps(state){
    return state;
}
const connectedHeader=connect(mapStateToProps)(Footer);
export { connectedHeader as Footer } 