import React from "react";
import { connect } from "react-redux";
import { Notification } from "../sections";

class MainRight extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var x = 7, y = 10;
        var fixRow = Array(y).fill(0);
        var blockTimeTable = Array(y).fill().map(function(){return Array(x).fill('')});
        var checkedClass = this.props.checkedClass;
        var classes = checkedClass.classes ? checkedClass.classes : null;
        var credits = 0, fee = 0;
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
                for (let i = 0; i < time.shift_end - time.shift_start; i++) 
                    fixRow[time.shift_start+i]++;
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
                for (let i = 0; i < time.shift_end - time.shift_start; i++) 
                    fixRow[time.shift_start+i]++;
            })
            credits+=c.credits ? c.credits : 0;
            fee     =365000*credits;
            console.log(blockTimeTable);
            
        })
        return (<div>
            <h1 className="title">Thời khóa biểu</h1>
            <Notification>{checkedClass.message && checkedClass.message}</Notification>
            <div className="timetable">
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
                            <th>chủ nhật</th>
                        </tr>
                    </thead>
                    <tbody>
                        { blockTimeTable.map((x,i)=>{
                                return (
                                    <tr key={i}>
                                        <td className="shift">{i+1}</td>
                                        { x.map((data,j)=>{
                                            let shift = i+1, day = j+2;
                                            let tooltip = data.name ? data.name + (data.lecturer && ' - '+ data.lecturer) : '';
                                            if(j < 7 - fixRow[shift-1])         
                                            return (
                                                <td key={j} data-tooltip={tooltip} rowSpan={data && data.time} className={`class${data && ' tooltip is-tooltip-bottom has-background-light'}`}>
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
    const { checkedClass } = state;
    return { checkedClass };
}
const connectedMainRight=connect(mapStateToProps)(MainRight);
export { connectedMainRight as MainRight } 