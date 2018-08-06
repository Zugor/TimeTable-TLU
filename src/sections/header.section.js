import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Header extends React.Component{
    constructor(props){
        super(props);
     
    }
    componentDidMount(){
      document.addEventListener('DOMContentLoaded', () => {

        // Get all "navbar-burger" elements
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      
        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {
      
          // Add a click event on each of them
          $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
      
              // Get the target from the "data-target" attribute
              const target = el.dataset.target;
              const $target = document.getElementById(target);
      
              // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
              el.classList.toggle('is-active');
              $target.classList.toggle('is-active');
      
            });
          });
        }
      
      });
    }
    render(){
       return (
<header>
  <nav className="navbar is-transparent">
    <div className="navbar-brand">
      <a className="navbar-item" href="/">
        <img src="/img/icon.png" alt="ThangLong Information Technology Club" width="32" height="32"/>
      </a>
      <div className="navbar-burger burger" data-target="navbarTransparent">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="navbarTransparent" className="navbar-menu">
      <div className="navbar-start">
        <a className="navbar-item" href="/">
          Xếp thời khóa biểu
        </a>
        <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link" href="#">
            Đăng ký học 
            <span className="tag is-danger">vip</span>
          </a>
          <div className="navbar-dropdown is-boxed">
            <a className="navbar-item" href="#">
              Tự động đăng ký học
            </a>
            <hr className="navbar-divider"/>
            <a className="navbar-item" href="#">
              Xem danh sách lớp
            </a>
          </div>
        </div>
      </div>

      <div className="navbar-end">
        <a className="navbar-item" target="_blank" href="https://www.facebook.com/CLB.TinHoc.TLU/">
          <span className="icon has-text-link">
            <i className="fab fa-facebook"></i>
          </span>
          <span>
            Facebook
          </span>
        </a>
        
        <a className="navbar-item" target="_blank" href="https://www.messenger.com/t/zugor81">
          <span className="icon has-text-warning">
            <i className="fas fa-donate"></i>
          </span>
          <span>Đóng góp</span>
        </a>
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