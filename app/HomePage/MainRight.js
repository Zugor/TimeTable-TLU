import React from "react";
import { connect } from "react-redux";
import { subjectActions } from "../actions";
import { Notification,LoadingPage } from "../sections";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver/FileSaver';

class MainRight extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            downloadLoading : false,
            exportLoading   : false,
            importLoading   : false,
            file            :    '',
        }
        this.handleDownload = this.handleDownload.bind(this);
        this.handleImport   = this.handleImport.bind(this);
        this.handleExport   = this.handleExport.bind(this);
        this.handleFile     = this.handleFile.bind(this);
    }
    handleImport(){
        document.getElementById('file').click();
    }
    handleFile(files){
        var reader = new FileReader();
        var {dispatch} = this.props;
		reader.onload = function(e) {
            try {
                let obj = JSON.parse(e.target.result);
                if(obj.semester && obj.year && obj.subjects){
                    dispatch(subjectActions.getSubjectsWithSemester(obj.year, obj.semester));
                    setTimeout(function(){
                        obj.subjects.forEach((subject)=>{
                            dispatch(subjectActions.tickCheckBoxSubject(subject.no, subject));
                        });
                        this.setState({importLoading : false});
                    }.bind(this), 6300);
                }
                else throw 0;
            } catch (e) {
                this.setState({file : 'File không hợp lệ!', importLoading : false});
            }
        }.bind(this);
        if(files && files.length>0){
            this.setState({importLoading : true});
            reader.readAsText(files[0], 'ISO-8859-1');
            this.setState({file : 'File: ' + files[0].name});
        }
        console.log(files);
        
    }
    handleExport(){
        this.setState({exportLoading : true});
        var { checkedClass, time } = this.props;
        var data = {
            year    :   time.year       ? time.year     : 2018,
            semester:   time.semester   ? time.semester : 110,
        };
        data['subjects'] = checkedClass.classes ? checkedClass.classes : [];
        
        var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "ThoiKhoaBieu.json");
        setTimeout(function(){ this.setState({exportLoading : false}); }.bind(this), 800);
    }
    handleDownload(){
        this.setState({downloadLoading : true});
        html2canvas(document.getElementById('timetable')).then(function(canvas) {
            canvas.toBlob(function(blob) {
                saveAs(blob, "ThoiKhoaBieu.png");
            });
            this.setState({downloadLoading : false});
        }.bind(this));
    }
    render(){
        var x = 7, y = 10;
        var fixRow = Array(y).fill(0);
        var blockTimeTable = Array(y).fill().map(function(){return Array(x).fill('')});
        var checkedClass = this.props.checkedClass;
        var classes = checkedClass.classes ? checkedClass.classes : null;
        var credits = 0, fee = 0;
        var shift_by_day = Array(x).fill().map(() => {return []});
        classes && classes.forEach((c)=>{
            c.classLT && c.classLT.time.forEach((time)=>{
                blockTimeTable[time.shift_start-1][time.day===1 ? 6 : time.day-2] = {
                    id          :   c.id,
                    name        :   c.name,
                    lecturer    :   c.classLT.lecturer,
                    room        :   c.classLT.room,
                    class       :   c.classLT.class,
                    day         :   time.day,
                    time        :   time.shift_end - time.shift_start +1,
                    credits     :   c.credits,
                }
                for (let i = 0; i < time.shift_end - time.shift_start; i++){
                    shift_by_day[time.day===1 ? 6 : time.day-2].push(time.shift_start+i+1);
                    fixRow[time.shift_start+i]++;
                }
            })
            c.time.forEach((time)=>{
                blockTimeTable[time.shift_start-1][time.day===1 ? 6 : time.day-2] = {
                    id          :   c.id,
                    name        :   c.name,
                    lecturer    :   c.lecturer,
                    room        :   c.room,
                    class       :   c.class,
                    day         :   time.day,
                    time        :   time.shift_end - time.shift_start +1,
                    credits     :   c.credits,
                }
                for (let i = 0; i < time.shift_end - time.shift_start; i++){
                    shift_by_day[time.day===1 ? 6 : time.day-2].push(time.shift_start+i+1);
                    fixRow[time.shift_start+i]++;
                }
            })
            credits+=c.credits ? c.credits : 0;
            fee     =365000*credits;
        });
        
        return (<div>
            <LoadingPage state={this.state.importLoading}/>
            <div className="columns is-mobile">
                <div className="column">
                    <h1 className="title">Thời khóa biểu</h1>
                    <h2 className="subtitle is-6">{this.state.file}</h2>
                </div>
                <div className="column is-one-third-mobile is-one-third-tablet">
                    <div className="field has-addons has-addons-right">
                        <p className="control">
                            <button className={`button is-link ${this.state.importLoading ? 'is-loading' : 'is-outlined'}`} onClick={this.handleImport}>
                                <span className="icon is-small is-marginless">
                                    <i className="fas fa-file-import"></i>
                                </span>
                                <span className="is-hidden-mobile">Import</span>
                            </button>
                            <input id="file" type="file" accept=".json" onChange={ (e) => this.handleFile(e.target.files) } hidden/>
                        </p>
                        <p className="control">
                            <button className={`button is-info ${this.state.exportLoading ? 'is-loading' : 'is-outlined'}`} onClick={this.handleExport}>
                                <span className="icon is-small is-marginless">
                                    <i className="fas fa-file-download"></i>
                                </span>
                                <span className="is-hidden-mobile">Export</span>
                            </button>
                        </p>
                        <p className="control is-hidden-mobile">
                            <button className={`button is-success ${this.state.downloadLoading ? 'is-loading' : 'is-outlined'}`} onClick={this.handleDownload}>
                                <span className="icon is-small is-marginless">
                                    <i className="fas fa-file-image"></i>
                                </span>
                                <span className="is-hidden-mobile">Lưu ảnh</span>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <Notification>{checkedClass.message && checkedClass.message}</Notification>
            <div id="timetable" className="timetable">
                <table className="table is-bordered is-narrow is-fullwidth">
                    <thead>
                        <tr className="is-selected">
                            <th width="50px">ca</th>
                            <th>thứ 2</th>
                            <th>thứ 3</th>
                            <th>thứ 4</th>
                            <th>thứ 5</th>
                            <th>thứ 6</th>
                            <th>thứ 7</th>
                            {shift_by_day[6].length !== 0 && <th>chủ nhật</th>}
                        </tr>
                    </thead>
                    <tbody>
                        { blockTimeTable.map((x,i)=>{
                                var shift = i+1;
                                return (
                                    <tr key={i}>
                                        <td className="shift">{shift}</td>
                                        { x.map((data,j)=>{
                                            let day = j+2;
                                            let tooltip = data.name ? data.name + (data.lecturer && ' - '+ data.lecturer) : '';
                                            
                                            if(shift_by_day[j].length>0 && shift_by_day[j].indexOf(shift) === -1
                                            || shift_by_day[j].length===0 || data)
                                                if(day === 8 && shift_by_day[j].length === 0 ){}
                                                else
                                                    return (
                                                        <td key={j} data-day={day} data-shift={shift} data-tooltip={tooltip} rowSpan={data ? data.time : 1} className={`class${data && ' tooltip is-tooltip-bottom has-background-light'}`}>
                                                        {data && data.class}
                                                        <p>{data && data.room} {data && '('+data.credits+' tín)'}</p>
                                                        </td>
                                                        )
                                            
                                            })
                                        }
                                    </tr>
                                    )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="extra-info">
                <p><strong>Tổng tín chỉ các môn đăng ký:</strong> {credits} tín</p>
                <p><strong>Tiền học dự kiến:</strong> {fee.toLocaleString()}₫</p>
            </div>
            </div>) 
    }
}
function mapStateToProps(state){
    const { checkedClass, time } = state;
    return { checkedClass, time };
}
const connectedMainRight=connect(mapStateToProps)(MainRight);
export { connectedMainRight as MainRight } 