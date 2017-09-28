import React, { Component } from 'react';
import Select from 'react-select';
import FileUpload from 'react-fileupload';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class UploadID extends Component {
  constructor(props){
    super(props);
    this.state = {
      iError : false,
      idnumber : '',
      multi : false,
      value : '',
      uploadFile : 'Browse Files',
      count : 0
    }

    this.onIDNumberChanged = this.onIDNumberChanged.bind(this);
    this.loadID = this.loadID.bind(this);

    this.idnumberError = 'Invalid ID Number';
    this.sn = false;
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
        account : evt.target.value
    })
  }

  onIDTypeChange(evt){
    this.setState({
      value : evt
    })
  }

  getOptions(input, callback) {
    const ids = OverlayStore.getIDTypes();
    callback(null, {options: ids,complete: true});
  }

  onOpen(evt){
    this.props.show();
  }

  render() {
    let show = false;
    let options={
        baseUrl:'/api/utils/statement/upload',
        dataType : 'json',
        wrapperDisplay : 'block',
        multiple: true,
        numberLimit: 9,
        accept: 'application/xlsx',
        chooseAndUpload : false,
        paramAddToField : {purpose: 'save'},
        fileFieldName : 'file',
        chooseFile : (files)=>{
            this.setState({uploadFile : files[0].name});
            this.sn = true;
            this.props.showNext(true);
        }
    }

    if(this.props.page === 5){
        show = true;
        this.props.showNext(this.sn);
    }

    return (
        <div className={show ?'row wizard-style':'hide'}>
            <div className="col-md-12">
            <div className="dialog-title">{this.props.title}</div>

                <div className="form-group">
                    <Select.Async multi={this.state.multi} placeholder="ID Type" value={this.state.value} onChange={this.onIDTypeChange.bind(this)} valueKey="value" labelKey="label" loadOptions={this.getOptions} />
                </div>
            
                <div className="">
                    <input type="text" className="form-control" placeholder="ID Number" value={this.state.idnumber} onChange={this.onIDNumberChanged.bind(this)}/>
                    <span className={this.state.iError ? 'error' : 'vamus'}>{this.idnumberError}</span>
                </div>

                <FileUpload className="show" options={options}>
                    <div ref="chooseBtn" className="form-group show">
                        <button className="btn btn-info btn-block" >{this.state.uploadFile}</button>
                    </div>

                    <div className="clearfix"></div>

                    <div ref="uploadBtn" className="form-group show">
                        <button className="btn btn-info btn-block">Upload</button>
                    </div>
                </FileUpload>

            </div>
        </div>
    );
  }
}

export default UploadID;