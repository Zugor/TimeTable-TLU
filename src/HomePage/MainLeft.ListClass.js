import React from "react";
import { connect } from "react-redux";
import KhongDau from "khong-dau";
import { subjectActions } from "../actions";

class ListClass extends React.Component{
    constructor(props){
        super(props);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }
    handleCheckbox(e) {
        var {dispatch, schoolTimeTable, checkedClass} = this.props;
        var value = e.target.value;
        var subject = schoolTimeTable.data.result.subjects[value];
        
        var day=[], shift=[];
        
        subject.classLT && subject.classLT.time.forEach(time => {
            day.push(time.day);
            let addshift = [];
            for (var i = time.shift_start; i <= time.shift_end; i++) {
                addshift.push(i);
            }
            shift.push(addshift);
        });
        
        subject.time.forEach(time => {
            let indexExistDay = day.indexOf(time.day);
            let addshift = [];
            for (var i = time.shift_start; i <= time.shift_end; i++) {
                addshift.push(i);
            }
            if(indexExistDay !== -1)
                shift[indexExistDay] = shift[indexExistDay].concat(addshift);
            else{
                day.push(time.day);
                shift.push(addshift);
            }
        });

        var duplicate = 0;
        if(checkedClass.classes) checkedClass.classes.forEach(obj => {
            if(subject.class !== obj.class){
                let subjectTime = obj.classLT ? obj.classLT.time : [];
                subjectTime = subjectTime.concat(obj.time);

                let result = subjectTime.filter((timeCheckedClass, i)=>{
                    let index = day.indexOf(timeCheckedClass.day);
                    return index !== -1 && (shift[index].indexOf(timeCheckedClass.shift_start) !== -1 || shift[index].indexOf(timeCheckedClass.shift_end) !== -1);
                })
                if(result.length > 0) duplicate = obj;
            }
        });
        
        if(!duplicate) dispatch(subjectActions.tickCheckBoxSubject(value, subject));
        else dispatch(subjectActions.messageTimeTable('Trùng lịch với môn ' + duplicate.name + ' - lớp ' + (duplicate.classLT ? duplicate.classLT.class+' + ' : '') + duplicate.class ));
    }
    render(){
        var {schoolTimeTable, schoolTimeTableFilter, search} = this.props;
        var subjects = (schoolTimeTableFilter.subjects && schoolTimeTableFilter.tab) ? schoolTimeTableFilter.subjects : (schoolTimeTable.data && schoolTimeTable.data.status) ? schoolTimeTable.data.result.subjects  : [];
        var status   = (schoolTimeTableFilter.subjects && schoolTimeTableFilter.tab) ? 'Không có môn nào' : (schoolTimeTable.data && schoolTimeTable.data.status === false) ? schoolTimeTable.data.message : 'Đang tải...';
        if(search){
            search   = KhongDau(search).toLowerCase();
            subjects = subjects.filter(function(subject) {
                return KhongDau(subject.name).toLowerCase().indexOf(search) !== -1 || KhongDau(subject.class).toLowerCase().indexOf(search) !== -1;
            });      
        }

        return (
            <div className="panel-subjects">
            { subjects.length > 0 ?
                subjects.map((subject,i)=>{
                    return (
                        <label className="panel-block" key={i}>
                            <input className="is-checkradio is-small" id={`subject-checkbox-${i}`} type="checkbox" defaultValue={subject.no} checked={subject.checked} onChange={this.handleCheckbox}/>
                            <label className="panel-title" htmlFor={`subject-checkbox-${i}`}>
                                { subject.classLT &&
                                    <p className="class-name">{subject.classLT.class}</p>
                                }
                                <p className="class-name">{subject.class}</p>
                                <span className="subject-name">{subject.name}{subject.classLT && subject.classLT.lecturer && ' - '+ subject.classLT.lecturer+'(LT)'} {subject.lecturer && ' - '+ subject.lecturer}{subject.classLT && '(BT)'}</span>
                            </label>

                            <label className="panel-addons">
                            {
                            subject.classLT && subject.classLT.time.map((time,j)=>{
                                return (
                                    <label key={j} className="tags has-addons" htmlFor={`subject-checkbox-${i}`}>
                                        <span className="tag">{time.day === 1 ? 'chủ nhật' : 'thứ '+time.day}</span>
                                        <span className="tag is-primary">{time.shift_start+'-'+time.shift_end}</span>
                                    </label>
                                )
                            })
                            }
                            {
                            subject.time && subject.time.map((time,j)=>{
                                return (
                                    <label key={j} className="tags has-addons" htmlFor={`subject-checkbox-${i}`}>
                                        <span className="tag">{time.day === 1 ? 'chủ nhật' : 'thứ '+time.day}</span>
                                        <span className="tag is-primary">{time.shift_start+'-'+time.shift_end}</span>
                                    </label>
                                )
                            })
                            }
                            </label>
                        </label>
                        )
                })
                : 
                    <label className="panel-block">
                        {(this.props.search && !schoolTimeTable.loading) ? 'Không tìm thấy' : status}
                    </label>
            }
            </div>
        )
    }
}
function mapStateToProps(state){
    const { schoolTimeTable,schoolTimeTableFilter,checkedClass } = state;
    return { schoolTimeTable,schoolTimeTableFilter,checkedClass };
}
const connectedMainLeft=connect(mapStateToProps)(ListClass);
export { connectedMainLeft as ListClass } 