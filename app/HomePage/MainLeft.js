import React from "react";
import { connect } from "react-redux";
import { subjectActions } from "../actions";
import { TabSubject, ListClass } from "./index";

class MainLeft extends React.Component{
    constructor(props){
        super(props);
        this.state = {  subjects    : [],
                        search      : '',
                        semester_option   : [
                            {id: 110,title: 'Học kỳ I nhóm 1'},
                            {id: 111,  title: 'Học kỳ I nhóm 2'}
                        ]
                    };
        this.handleChangeYear = this.handleChangeYear.bind(this);
        this.handleChangeSemester = this.handleChangeSemester.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleResetTick = this.handleResetTick.bind(this);
    }
    handleChangeYear(e) {
        var {dispatch} = this.props;
        var value    = Number(e.target.value);
        var semester = 110;
        if(value === 2018)
            semester = 110;
        else if(value === 2017)
            semester = 101;
        
        this.setState({semester: semester});
        dispatch(subjectActions.getSubjectsWithSemester(value, semester));
    }
    handleChangeSemester(e) {
        var {dispatch, time} = this.props;
        var value    = Number(e.target.value);
        var year     = time && time.year ? time.year : 2018;
        dispatch(subjectActions.getSubjectsWithSemester(year, value));
    }
    componentDidMount(){
        this.props.dispatch(subjectActions.getSubjects());
    }
    handleSearch(e) {
        var value = e.target.value;
        this.setState({search : value});
    }
    handleResetTick(){
        this.props.dispatch(subjectActions.resetTickSubjects());
    }
    render(){
        var {time} = this.props;
        var _data =  {
                        year        : time.year     ? time.year     : 2018,
                        semester    : time.semester ? time.semester : 110,
                    }
        if(_data.year === 2018){
            _data['semester_option']  = [
                {id: 110,  title: 'Học kỳ I nhóm 1'},
                {id: 111,  title: 'Học kỳ I nhóm 2'},
            ];
        }
        else if(_data.year === 2017){
            _data['semester_option']  = [
                {id: 101,  title: 'Học kỳ I nhóm 1'},
                {id: 102,  title: 'Học kỳ I nhóm 2'},
                {id: 103,  title: 'Học kỳ I nhóm 3'},
                {id: 104,  title: 'Học kỳ II nhóm 1'},
                {id: 105,  title: 'Học kỳ II nhóm 2'},
                {id: 106,  title: 'Học kỳ II nhóm 3'},
                {id: 107,  title: 'Học kỳ III nhóm 1'},
                {id: 108,  title: 'Học kỳ III nhóm 2'},
                {id: 109,  title: 'Học kỳ III nhóm 3'},
            ];
        }
        return (<div>
        <div className="field">
            <p className="control">
                <span className="select is-fullwidth">
                    <select value={_data.year} onChange={this.handleChangeYear}>
                        <option value="2018">Năm học 2018 - 2019</option>
                        <option value="2017">Năm học 2017 - 2018</option>
                    </select>
                </span>
            </p>
        </div>

        <div className="field">
            <p className="control">
                <span className="select is-fullwidth">
                    <select value={_data.semester} onChange={this.handleChangeSemester}>
                    {_data.semester_option.map((s,i)=>{
                            return (
                            <option value={s.id} key={i}>{s.title}</option>
                            )  
                        })
                    }
                    </select>
                </span>
            </p>
        </div>
        
        <nav className="panel">
            <p className="panel-heading">Lớp học</p>
            <div className="panel-block">
                <p className="control has-icons-left">
                <input className="input is-small" type="text" value={this.state.search} placeholder="tìm kiếm" onChange={this.handleSearch}/>
                <span className="icon is-small is-left">
                    <i className="fas fa-search" aria-hidden="true"></i>
                </span>
                </p>
            </div>
            <TabSubject/>
            <ListClass search={this.state.search}/>

            <div className="panel-block">
                <button className="button is-link is-outlined is-fullwidth" onClick={this.handleResetTick}>
                làm lại
                </button>
            </div>
        </nav>

        </div>) 
    }
}
function mapStateToProps(state){
    const { schoolTimeTable,schoolTimeTableFilter,time } = state;
    return { schoolTimeTable,schoolTimeTableFilter,time };
}
const connectedMainLeft=connect(mapStateToProps)(MainLeft);
export { connectedMainLeft as MainLeft } 