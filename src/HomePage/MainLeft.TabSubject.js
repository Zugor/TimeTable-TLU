import React from "react";
import { connect } from "react-redux";
import { subjectActions } from "../actions";

class TabSubject extends React.Component{
    constructor(props){
        super(props);
    }
    switchTab(tab){
        var {dispatch, schoolTimeTable} = this.props;
        if(schoolTimeTable.data) dispatch(subjectActions.filterSubjects(tab, schoolTimeTable.data.result.subjects));
    }
    render(){
        var {schoolTimeTableFilter} = this.props;
        return (
            <p className="panel-tabs">
                <a className={!schoolTimeTableFilter.tab || schoolTimeTableFilter.tab==='tatca' ? 'is-active' : ''} onClick={this.switchTab.bind(this, 'tatca')}>tất cả</a>
                <a className={schoolTimeTableFilter && schoolTimeTableFilter.tab==='daicuong' ? 'is-active' : ''} onClick={this.switchTab.bind(this, 'daicuong')}>đại cương</a>
                <a className={schoolTimeTableFilter && schoolTimeTableFilter.tab==='theduc' ? 'is-active' : ''} onClick={this.switchTab.bind(this, 'theduc')}>thể dục</a>
                <a className={schoolTimeTableFilter && schoolTimeTableFilter.tab==='dachon' ? 'is-active' : ''} onClick={this.switchTab.bind(this, 'dachon')}>đã chọn</a>
            </p>
        )
    }
}
function mapStateToProps(state){
    const { schoolTimeTable,schoolTimeTableFilter } = state;
    return { schoolTimeTable,schoolTimeTableFilter };
}
const connectedMainLeft=connect(mapStateToProps)(TabSubject);
export { connectedMainLeft as TabSubject } 