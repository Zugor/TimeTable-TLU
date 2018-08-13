import React from "react";

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
            Phát triển bởi <a target="_blank" href="https://www.facebook.com/CLB.TinHoc.TLU/">Câu lạc bộ Tin học</a> - trường Đại Học Thăng Long
            </p>
        </div>
    </div>
</footer>
        ) 
    }
}
export { Footer } 