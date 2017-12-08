import React, { Component } from 'react';
import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';
import '../../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';
import icam_icon2 from '../../icons/icam_logo_.png';
import thumb_icon from '../../icons/sheets.svg';
import {Link} from 'react-router-dom';

import FileUpload from 'react-fileupload';
import 'react-select/dist/react-select.css';

import UploadStore from '../../stores/UploadStore';
import * as UploadAction from '../../actions/UploadAction';
import * as utils from '../../utils/utils';
import cookie from 'react-cookies';

import ReactSVG from 'react-svg';


class Upload extends Component {
    constructor(props){
        super(props);
        this.uploadButtonText = 'Upload';
        this.descriptionErrorMessage = 'Please Add A Description';
        this.allBanks = [];
        this.state = {
            bank : 0,
            uploadFile : 'Browse Files',
            desc : '',
            count : 0,
            uploadMsg : '',
            showSuccess : false,
            showLoading : false,
            showError : false,
            showFailed : false,
            showUpload : false
        }

        this.refresh = this.refresh.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onBankChanged= this.onBankChanged.bind(this);

        this.loadingSuccessMsg = this.loadingSuccessMsg.bind(this);
        this.loadingLoadingMsg = this.loadingLoadingMsg.bind(this);
        this.loadingErrorMsg = this.loadingErrorMsg.bind(this);
        this.loadingFailedMsg = this.loadingFailedMsg.bind(this);
    }

    componentWillMount(){
        UploadAction.loadICBanks();                
        UploadStore.on('upload_banks_loaded',this.refresh);
        // this.clearCookies();
    }

    componentWillUnMount(){
        UploadStore.removeListener('upload_banks_loaded',this.refresh);
    }

    onBankChanged(evt){
        this.setState({
            bank : evt.target.value
        })

        if(evt.target.value > 0){
            this.setState({
                uploadMsg : '',
                showUpload : true
            })
        }else{
            this.setState({
                uploadMsg : '',
                showUpload : false
            })
        }
    }

    refresh(){
        this.setState({
            count : this.state.count + 1
        })
    }

    onDescriptionChange(evt){
        this.setState({
            desc : evt.target.value
        })
    }

    onUploadClicked(){

    }

    getSelectOptions(data){
        if(data){
          return data.map((d)=>{
            return <option value={d.value}>{d.label}</option>
          })
        }
    }

    loadingSuccessMsg(){
        this.setState({
            uploadMsg : 'Upload Complete',
            showSuccess : true,
            showLoading : false,
            showError : false,
            showFailed : false
        })
    }

    loadingLoadingMsg(progress){
        this.setState({
            uploadMsg : 'Uploading ... '+(progress.loaded/progress.total)+'%',
            showSuccess : false,
            showLoading : true,
            showError : false,
            showFailed : false
        })
    }

    loadingErrorMsg(){
        this.setState({
            uploadMsg : 'Upload Error',
            showSuccess : false,
            showLoading : false,
            showError : true,
            showFailed : false
        })
    }

    loadingFailedMsg(){
        this.setState({
            uploadMsg : 'Upload Failed',
            showSuccess : false,
            showLoading : false,
            showError : false,
            showFailed : true
        })
    }

    render() {
        const app = this;
        const options={
            //baseUrl:'/api/v1/uploads',
            baseUrl:'/api/utils/statement/upload',            
            dataType : 'json',
            wrapperDisplay : 'block',
            multiple: true,
            numberLimit: 9,
            accept: 'application/xlsx',
            chooseAndUpload : false,
            paramAddToField : {user_id : UploadStore.getUserId(), filename : this.state.uploadFile, token : UploadStore.getToken(), bank_id: this.state.bank, description : this.state.desc},
            fileFieldName : 'file',
            chooseFile : (files)=>{
                this.setState({uploadFile : files[0].name});
            },
            uploading : (progress)=>{
                console.log('loading...',progress.loaded/progress.total+'%')

                app.loadingLoadingMsg(progress);
            },
            uploadSuccess : (resp)=>{
                console.log('upload success..!')

                app.loadingSuccessMsg();
            },
            uploadError : (err)=>{
                 
                app.loadingErrorMsg();       
            },
            uploadFail : (resp)=>{
                
                app.loadingFailedMsg();
            }
        }
        return (
            <div className="upload">
                <div className="ad col-md-4 sider hidden-sm hidden-xs">
                    
                    <div className="col-md-12 target logo">
                        <ReactSVG path={thumb_icon} callback={svg => {}} className="svg" ref="chooseBtn"/>
                    </div>
                </div>

                <div className="content col-md-8 col-sm-12 col-xs-12">
                    <div className="sign-in-wrapper">
                        <div className="sign-container">
                            <div className="text-center">
                                <h2 className="logo">
                                    <Img src={icam_icon2} className="login-icon" />
                                </h2>
                                <br/>
                                <div className="title">Upload Bank Statememts</div>
                            </div>

                            <div className="sign-in-form">

                                <div className={this.state.showSuccess ? 'form-group' : 'hide'}>
                                    <div style={{textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', fontWeight: '600', color: '#2e7d32'}}>{this.state.uploadMsg}</div>                      
                                </div>

                                <div className={this.state.showLoading ? 'form-group' : 'hide'}>
                                    <div style={{textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', fontWeight: '600', color: '#ff8f00'}}>{this.state.uploadMsg}</div>                      
                                </div>

                                <div className={this.state.showError ? 'form-group' : 'hide'}>
                                    <div style={{textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', fontWeight: '600', color: '#c62828'}}>{this.state.uploadMsg}</div>                      
                                </div>

                                <div className={this.state.showFailed ? 'form-group' : 'hide'}>
                                    <div style={{textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', fontWeight: '600', color: '#c62828'}}>{this.state.uploadMsg}</div>                      
                                </div>

                                <div className="form-group">
                                    <select className="form-control" value={this.state.bank} onChange={this.onBankChanged}>
                                        {this.getSelectOptions(UploadStore.getBanks())}
                                    </select>                        
                                </div>

                                {/* <div className="form-group">
                                    <input type="text" className="form-control" value={this.state.desc} placeholder="Description" onChange={this.onDescriptionChange.bind(this)} />
                                    <span className={this.state.uError ? 'error' : 'vamus'}>{this.descriptionErrorMessage}</span>
                                </div> */}

                                <FileUpload className={this.state.showUpload ? 'show' : 'hide'} options={options}>
                                    <div ref="chooseBtn" className="form-group show">
                                        <button className="btn btn-info btn-block" >{this.state.uploadFile}</button>
                                    </div>

                                    <div className="clearfix"></div>

                                    <div ref="uploadBtn" className="form-group show">
                                        <button className="btn btn-info btn-block">Upload</button>
                                    </div>
                                </FileUpload>
                            
                                <br />
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