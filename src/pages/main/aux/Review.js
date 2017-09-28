import React, { Component } from 'react';
import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class Review extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount(){

  }

  render() {
    let show = false;
    if(this.props.page === 6){
        show = true;
    }

    return (
        <div className={show ? 'row wizard-style': 'hide'}>
            <div className="col-md-12 review">
                <div className="col-md-5 review-label">Mobile </div>
                <div className="col-md-7 review-value">024 422-2222</div>
                <div className="col-md-5 review-label">Bank Name</div>
                <div className="col-md-7 review-value">Bank Of Ghana</div>
                <div className="col-md-5 review-label">Account Number</div>
                <div className="col-md-7 review-value">080800099900099900</div>
                <div className="col-md-5 review-label">Approver</div>
                <div className="col-md-7 review-value">Jane Doe</div>
                <div className="col-md-5 review-label">Mobile</div>
                <div className="col-md-7 review-value">024 456-7567</div>
            </div>
        </div>
    );
  }
}

export default Review;