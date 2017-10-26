import React, { Component } from 'react';
import FileUpload from 'react-fileupload';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import * as utils from '../../../utils/utils';

import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class IndividualUploadID extends Component {
  constructor(props){
    super(props);
    this.state = {
      idnumber : '',
      multi : false,
      value : '',
      uploadFile : 'Browse Files',
      count : 0
    }

    this.onIDNumberChanged = this.onIDNumberChanged.bind(this);
    this.onIDTypeChange = this.onIDTypeChange.bind(this);
    this.loadID = this.loadID.bind(this);

    this.type = '';
    this.type_id = 0;

    this.idnumberError = 'Invalid ID Number';
    this.iError = false;

    this.typeError = 'Please Select ID Type';
    this.tError = false;

    this.uploadError = 'Please Upload ID';
    this.uError = false;
  }

  componentWillMount(){
   OverlayAction.loadIDTypes();
   OverlayStore.on('overlay_idtypes_loaded', this.loadID);
  }

  loadID(){
    this.setState({
        count : this.state.count + 1
    })
  }

  onIDNumberChanged(evt){
    this.setState({
        idnumber : evt.target.value
    })
  }

  onIDTypeChange(e){
    this.setState({
      value : e.target.value
    })

    const id_types = OverlayStore.getIDTypes().find((id)=>{
      return parseInt(e.target.value) === parseInt(id.value);
    })

    this.type = id_types.label;
    this.type_id = e.target.value;
  }

  onNextClicked(evt){
    if(this.validate()){
        this.refresh();
        OverlayStore.next();
        
      }else{
        this.refresh();
      }
  }

  onBackClicked(){
    OverlayStore.back();
  }

  refresh(){
    this.setState({
      count : this.state.count + 1
    });
  }

  validate(){
    let detail = {};

    //Check ID Type
    console.log('Type '+this.type);
    if(this.type && this.type.trim().length > 4 && utils.isAlphabets(this.type)){
      detail.id_type = this.type;
      detail.id_type_id = this.type_id;

      this.tError = false;
    }else{
      this.typeError = 'Please Select ID Type';
      this.tError = true;
      return false;
    }

    //Check ID Number
    console.log('ID Number '+this.state.idnumber);
    if(this.state.idnumber && this.state.idnumber.trim().length > 6){
      detail.id_number = this.state.idnumber;
      this.iError = false;
    }else{
      this.idnumberError = 'Please Enter Correct ID Number';
      this.iError = true;
      return false;
    }

    //Check Upload
    console.log('Upload File '+this.state.uploadFile);
    if(this.state.uploadFile && !(this.state.uploadFile === 'Browse Files') &&this.state.uploadFile.trim().length > 4){
        detail.filename = this.state.uploadFile;
        this.uError = false;
      }else{
        this.uploadError = 'Please Upload ID';
        this.uError = true;
        return false;
      }

    //Push data to store
    OverlayStore.setIDInfo(detail);

    return true;
  }

  getSelectOptions(data){
    if(data){
      return data.map((d)=>{
        return <option value={d.value}>{d.label}</option>
      })
    }else{
      return <option value="0">Loading ...</option>
    }
  }

  render() {
    let show = false;
    let options={
        baseUrl:'/api/utils/statement/upload',
        dataType : 'json',
        wrapperDisplay : 'block',
        multiple: false,
        numberLimit: 1,
        accept: 'application/xlsx',
        chooseAndUpload : false,
        paramAddToField : {purpose: 'save'},
        fileFieldName : 'file',
        chooseFile : (files)=>{
            this.setState({uploadFile : files[0].name});
        }
    }

    if(this.props.page === parseInt(this.props.pageNumber)){
    return (
        <div className='row wizard-style'>
            <div className="col-md-12">
            <div className="dialog-title">{this.props.title}</div>
            <div className="clearfix"></div>
                <div className="overlay-content-style">
                    <div className="form-style">
                      <select className="form-control" defaultValue={this.state.value} onChange={this.onIDTypeChange}>
                        {this.getSelectOptions(OverlayStore.getIDTypes())}
                      </select>
                      <span className={this.tError ? 'error' : 'vamus'}>{this.typeError}</span>
                    </div>
                    <div className="clearfix"></div>
                    <div className="form-style">
                        <input type="text" className="form-control" placeholder="ID Number" value={this.state.idnumber} onChange={this.onIDNumberChanged.bind(this)}/>
                        <span className={this.iError ? 'error' : 'vamus'}>{this.idnumberError}</span>
                    </div>
                    <div className="clearfix"></div>
                    <FileUpload className="show" options={options}>
                        <div ref="chooseBtn" className="form-style show">
                            <button className="btn btn-info btn-block" >{this.state.uploadFile}</button>
                        </div>

                        <div className="clearfix"></div>

                        <div ref="uploadBtn" className="form-style show">
                            <button className="btn btn-info btn-block">Upload</button>
                            <span className={this.uError ? 'error' : 'vamus'}>{this.uploadError}</span>
                        </div>
                    </FileUpload>
                    <div className="clearfix"></div>
                </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-xs-12">
                    <div className='col-md-6 col-xs-6'>
                      <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onBackClicked.bind(this)}>Back</a>
                    </div>
                    <div className='col-md-6 col-xs-6'>
                      <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onNextClicked.bind(this)}>Next</a>
                    </div>
              </div>
            </div>
        </div>
    );
    }else{
        return null;
    }
  }
}

export default IndividualUploadID;