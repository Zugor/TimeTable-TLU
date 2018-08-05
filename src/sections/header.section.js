import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Header extends React.Component{
    constructor(props){
        super(props);
     
    }
    render(){
       return (
<header>
  <nav className="navbar is-transparent">
    <div className="navbar-brand">
      <a className="navbar-item" href="https://bulma.io">
        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"/>
      </a>
      <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="navbarExampleTransparentExample" className="navbar-menu">
      <div className="navbar-start">
        <a className="navbar-item" href="https://bulma.io/">
          Xếp thời khóa biểu
        </a>
        <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link" href="/documentation/overview/start/">
            Đăng ký học 
            <span className="tag is-danger">vip</span>
          </a>
          <div className="navbar-dropdown is-boxed">
            <a className="navbar-item" href="/documentation/overview/start/">
              Tự động đăng ký học
            </a>
            <hr className="navbar-divider"/>
            <a className="navbar-item" href="https://bulma.io/documentation/modifiers/syntax/">
              Xem danh sách lớp
            </a>
          </div>
        </div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="field is-grouped">
            <p className="control">
              <a className="bd-tw-button button" target="_blank" href="https://twitter.com/intent/tweet?text=Bulma: a modern CSS framework based on Flexbox&amp;hashtags=bulmaio&amp;url=http://localhost:4000&amp;via=jgthms">
                <span className="icon">
                  <i className="fab fa-facebook"></i>
                </span>
                <span>
                  Facebook
                </span>
              </a>
            </p>
            <p className="control">
              <a className="button is-primary" href="https://github.com/jgthms/bulma/releases/download/0.7.1/bulma-0.7.1.zip">
                <span className="icon">
                  <i className="fas fa-donate"></i>
                </span>
                <span>Đóng góp</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</header>
        ) 
    }
}
function mapStateToProps(state){
    return state;
}
const connectedHeader=connect(mapStateToProps)(Header);
export { connectedHeader as Header } 