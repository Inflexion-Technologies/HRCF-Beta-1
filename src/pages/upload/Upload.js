import React, { Component } from 'react';
import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';
import '../../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';
import icam_icon2 from '../../icons/icam_logo_.png';
import thumb_icon from '../../icons/sheets.svg';
import {Link} from 'react-router-dom';

import Select from 'react-select';
import FileUpload from 'react-fileupload';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

import UploadStore from '../../stores/UploadStore';
import * as UploadAction from '../../actions/UploadAction';
import * as utils from '../../utils/utils';
import cookie from 'react-cookies';

import ReactSVG from 'react-svg';


class Upload extends Component {
    constructor(props){
        super(props);
        this.loadBanks = this.loadBanks.bind(this);
        this.uploadButtonText = 'Upload';
        this.descriptionErrorMessage = 'Please Add A Description';
        this.allBanks = [];
        this.state = {
            uError : false,
            isButtonDisabled : false,
            isBanksLoading : true,
            value : '',
            multi : false
        }

        //UploadAction.loadBanks();
    }

    componentWillMount(){
        UploadAction.loadBanks();                
        UploadStore.on('upload_banks_loaded',this.loadBanks);
        // this.clearCookies();
    }

    componentWillUnMount(){
        UploadStore.removeListener('upload_banks_loaded',this.loadBanks);
    }

    loadBanks(){
        this.allBanks = UploadStore.getBanks();
        console.log("Banks ::: "+JSON.stringify(this.allBanks));
        this.setState({
            isBanksLoading : false
        })
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.onLoginClicked();
        }
    }

    getOptions(input, callback) {
        const banks = UploadStore.getBanks();
        callback(null, {options: banks,complete: true});
    };

    clearCookies(){
        cookie.remove('fname');
        cookie.remove('lname');
        cookie.remove('msisdn');
        cookie.remove('pswd');
    }

    redirect(link){
        this.props.history.push(link);
    }

    onBankChange(evt){
        console.log('Value ::: '+JSON.stringify(evt));
        this.setState({
            inputValue : evt.label
        })
    }

    onChange(value){
        this.setState({
			value: value,
		});
    }

    onDescriptionChange(evt){

    }

    onUploadClicked(){

    }

    render() {
        const options={
            baseUrl:'http://localhost:8001/api/utils/statement/upload',
            dataType : 'json',
            wrapperDisplay : 'block',
            multiple: true,
            numberLimit: 9,
            accept: 'application/xlsx',
            chooseAndUpload : false,
            paramAddToField : {purpose: 'save'},
            fileFieldName : 'file',
        }
        return (
            <div className="login">
                <div className="ad col-md-8 hidden-sm hidden-xs">
                    <div>
                        <Img src={icam_icon} className="icon" />
                    </div>
                    <div className="col-md-12 target">
                        <ReactSVG path={thumb_icon} callback={svg => {}} className="svg" ref="chooseBtn"/>
                    </div>
                </div>

                <div className="control col-md-4 col-sm-12 col-xs-12">
                    <div className="sign-in-wrapper">
                        <div className="sign-container">
                            <div className="text-center">
                                <h2 className="logo">
                                    <Img src={icam_icon2} className="login-icon" />
                                </h2>
                                <br/>
                                <h4 className="title-typo-style">Upload Bank Statememts</h4>
                            </div>

                            <div className="sign-in-form">

                                <div className="form-group">
                                    <Select.Async multi={this.state.multi} placeholder="Select A Bank" value={this.state.value} onChange={this.onChange.bind(this)} valueKey="value" labelKey="label" loadOptions={this.getOptions} />
                                </div>

                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Description" onChange={this.onDescriptionChange.bind(this)} />
                                    <span className={this.state.uError ? 'error' : 'vamus'}>{this.descriptionErrorMessage}</span>
                                </div>

                                <FileUpload className="show" options={options}>
                                    <div ref="chooseBtn" className="form-group show">
                                        <button className="btn btn-info btn-block" >Browse Files</button>
                                    </div>

                                    <div className="clearfix"></div>

                                    <div ref="uploadBtn" className="form-group show">
                                        <button className="btn btn-info btn-block">Upload</button>
                                    </div>
                                </FileUpload>
                            
                                <br />
                                <Link to="/login" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style">Back to Login</a></Link>
                            </div>
                            <div className="text-center copyright-txt">
                                <small className="typo-style">IC Asset Managers  - Copyright © 2017</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Upload;