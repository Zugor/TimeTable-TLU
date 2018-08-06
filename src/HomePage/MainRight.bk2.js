import React from "react";
import { connect } from "react-redux";
import { Notification } from "../sections";
import factorial from "factorial";

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
        var classList = [];
        classes && classes.forEach((c)=>{
            c.classLT && c.classLT.time.forEach((time)=>{
                classList.push({
                    id          :   c.id,
                    name        :   c.name,
                    lecturer    :   c.classLT.lecturer,
                    room        :   c.classLT.room,
                    class       :   c.classLT.class,
                    day         :   time.day,
                    shift_start :   time.shift_start,
                    shift_end   :   time.shift_end,
                    credits     :   c.credits,
                })
            });
            c.time.forEach((time)=>{
                classList.push({
                    id          :   c.id,
                    name        :   c.name,
                    lecturer    :   c.lecturer,
                    room        :   c.room,
                    class       :   c.class,
                    day         :   time.day,
                    shift_start :   time.shift_start,
                    shift_end   :   time.shift_end,
                    credits     :   c.credits,
                })
            });
            credits+=c.credits ? c.credits : 0;
            fee     =365000*credits;     
        })
        return (<div>
            <h1 className="title">Thời khóa biểu</h1>
            <Notification>{checkedClass.message && checkedClass.message}</Notification>
            <div className="timetable">
            <div>
                { classList.map((data,i)=>{
                    let day  = data.day === 1 ? 8 : data.day;
                    let time = data.shift_end - data.shift_start +1;
                    let top     = 34 * (data.shift_start),
                        width   = 12.8,
                        left    = width*(day-2),
                        fixLeft = 45 + 2*day,
                        height  = 31 * time + 1.6 **time;
                        if(day>5) fixLeft += factorial(day-4);
                    return (
                        <div className="class" key={i} style={{
                            position: 'absolute',
                            marginTop     : top+'px',
                            marginLeft    : 'calc('+left+'% + '+fixLeft+'px)',
                            width         : width+'%',
                            height        : height+'px',
                            backgroundColor: 'hsl(0, 0%, 96%)'}}>
                            <span className="tkb_span1">{data && data.class}</span><br/>
                            <span className="tkb_span2">{data && data.room} {data && '('+data.credits+' tín)'}</span>
                        </div>
                        )
                    })
                }
                </div>
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
                                            return (
                                                <td key={j}>
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