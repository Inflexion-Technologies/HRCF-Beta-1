import React, { Component } from 'react';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
//import '../../styles/app.v1.scss';
import '../../styles/custom.css';

//import _ from 'lodash';

class Footer extends Component {
  render() {
    return (
        <footer className="footer hidden-xs no-padder text-center-nav-xs">
        <a href="modal.lockme.html" data-toggle="ajaxModal"
            className="btn btn-icon icon-muted btn-inactive pull-right m-l-xs m-r-xs hidden-nav-xs">
            <i className="i i-logout"></i>
        </a>
        <a href="#nav" data-toggle="className:nav-xs"
            className="btn btn-icon icon-muted btn-inactive m-l-xs m-r-xs">
            <i className="i i-circleleft text"></i>
            <i className="i i-circleright text-active"></i>
        </a>
    </footer>
    );
  }
}

export default Footer;