const fs              = require('fs');
const express         = require('express');
const async           = require("async");
const path            = require('path');
const bodyParser      = require('body-parser');
const app             = module.exports=express();
const router          = express.Router();
const Entities        = require('html-entities').AllHtmlEntities;
const entities        = new Entities();
const chunk          = require('lodash').chunk;

var request           = require('request');
    request           = request.defaults({jar: true});
var cookie            = request.cookie('ASP.NET_SessionId=wbifdss0vb5u0w5zqir4ewq3; .ASPXAUTH=1661B61EC16F86F4649E3DAEB0896329B60EA2AB9D8E75CAB2C7D25A2C3BD42894F25C40F85E46255FA198B45740C37F3FF24D4781CABFC7FE9105B9BC4014CEDBBBE949014D958133315FE9628EE676F2376B22B9BC8C842CF773DC2E3959553E0598976DDF00AF1B1D48D32F4819DBEC10CB87B1D3B720B8A652D7769910F4');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine','ejs');
// set views for error and 404 pages
app.set('views',path.join(__dirname,'views'));

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
//
    // Pass to next layer of middleware
    next();
});

const MESSAGE={
    REQUEST_TIME_OUT            : 'Không nhận được phản hồi từ máy chủ.',
    GET_DATA_ERROR              : 'Không lấy được dữ liệu.',
    GET_DATA_YEARS_ERROR        : 'Không lấy được danh sách năm học.',
    GET_DATA_SEMESTERS_ERROR    : 'Không lấy được danh sách học kỳ.',
    GET_DATA_SUBJECTS_ERROR     : 'Không lấy được danh sách môn học.',
    PARAM_IS_INVALID            : 'Tham số không đúng.',
};

String.prototype.cutString = function(str_left, str_right) {
    var pos_left = this.indexOf(str_left) + str_left.length;
    return this.substring(
        pos_left, 
        this.substring(pos_left).indexOf(str_right)+pos_left);
}
router.get("/getData",function(req,res,next){
    var results={};
    var htmldata;
    var err = null;
    async.series([
        function(callback){
            var options = {
                url: 'https://dangkyhoc.thanglong.edu.vn/ToanTruong/TKBToanTruong.aspx',
                method: 'GET',
                timeout: 6000,
                headers: {'Cookie': cookie}
            };
            request(options, function (error, res, body) {
                if(error && error.code === 'ETIMEDOUT') err = MESSAGE.REQUEST_TIME_OUT;
                else body && body.indexOf('ctl00_c_droNam') > 0 ? 
                    htmldata = body
                : err = MESSAGE.GET_DATA_ERROR;
                callback(err,null);
            });
        },
        function(callback){
            results['years'] = [];
            let data = entities.decode(htmldata.cutString('ctl00_c_droNam', '</select>').trim());
            let year_id = data.match(/[value="]\d+"/g).map(s => s.replace(/"/g , ''));
            let year_title = data.match(/\>(.*?)<\/option>/g).map(s => s.replace('</option>','').replace(/>/ , '').trim());
            year_id ? year_id.map(function (id, i) {
                results.years.push({id: Number(id), title: year_title[i]});
            }) : err = MESSAGE.GET_DATA_SEMESTERS_ERROR;
            callback(err,null);
        },
        function(callback){
            results['semesters'] = [];
            let data = entities.decode(htmldata.cutString('ctl00_c_droHocki', '</select>').trim());
            let semester_id = data.match(/[value="]\d+"/g).map(s => s.replace(/"/g , ''));
            let semester_title = data.match(/Học kỳ(.*?)<\/option>/g).map(s => s.replace('</option>','').trim());
            semester_id ? semester_id.map(function (id, i) {
                results.semesters.push({id: Number(id), title: semester_title[i]});
            }) : err = MESSAGE.GET_DATA_SEMESTERS_ERROR;
            callback(err,null);
        },
        function(callback){
            results['subjects'] = [];
            let data = entities.decode(htmldata.cutString('ctl00_c_gridThoiKhoaiBieuTR', '</table>').trim());
            let td_tag = data.match(/<td>(.*?)<\/td>/g).map(s => s.replace(/<(\/|)td>/g,'').trim());
            let subject = chunk(td_tag, 8);
            td_tag ? subject.map(function (s, i) {
                let shift = s[4].split('-');
                let index = results.subjects.findIndex(function(subject) {return subject.class === s[2]});
                if(index === -1)
                    results.subjects.push({ id              :       s[0],
                                            name            :       s[1],
                                            class           :       s[2],
                                            time            :       [{  day         : Number(s[3]),
                                                                        shift_start : Number(shift[0]),
                                                                        shift_end   : Number(shift[1]),
                                                                    }],
                                            room            :       s[5],
                                            credits         :       Number(s[6]),
                                            lecturer        :       s[7],
                                            checked         :       0,
                                        });                
                else{
                    let indexDay = results.subjects[index].time.findIndex(function(time) {return time.day === Number(s[3])});
                    if(indexDay !== -1 && results.subjects[index].time[indexDay].shift_end === Number(shift[0])-1)
                        results.subjects[index].time[indexDay].shift_end = Number(shift[1]);
                    else
                        results.subjects[index].time.push({
                            day         : Number(s[3]),
                            shift_start : Number(shift[0]),
                            shift_end   : Number(shift[1]),
                        });
                }
            }) : err = MESSAGE.GET_DATA_SUBJECTS_ERROR;
            callback(err,null);
        },
        function(callback){
            results.subjects.map((subject,i)=>{
                let subjectClass = subject.class;
                if(subjectClass.indexOf('(L.CHON)') !== -1)
                    subjectClass = subjectClass.replace('(L.CHON)','').replace(' ','');

                let subjectBT = subjectClass.match(/([A-Z]\w+)\.((\d)(\.\d)?)_BT/);
                if(subjectBT){
                    let nameSubjectLT = subjectBT[1]+'.'+subjectBT[3]+'_LT';
                    let indexSubjectLT = results.subjects.findIndex(subject => subject.class.indexOf(nameSubjectLT)!==-1);
                    if(indexSubjectLT !== -1) results.subjects[i]['classLT'] = {
                        class           :       results.subjects[indexSubjectLT].class,
                        time            :       results.subjects[indexSubjectLT].time,
                        room            :       results.subjects[indexSubjectLT].room,
                        lecturer        :       results.subjects[indexSubjectLT].lecturer
                    }
                }
            });
            callback(null,null);
        },
        function(callback){
            const subjectLT = results.subjects.filter(subject => subject.class.match(/([A-Z]\w+)\.(\d)_LT/g));
            subjectLT.forEach(subject=>{
                let indexSubjectLT = results.subjects.findIndex(obj => obj.class.indexOf(subject.class)!==-1);
                if(indexSubjectLT !== -1) results.subjects.splice(indexSubjectLT, 1);
            });
            callback(null,null);
        },
        function(callback){
            for (let i = 0; i < results.subjects.length; i++)
                results.subjects[i]['no'] = i;
            callback(null,null);
        },
        function(callback){
            let file = __dirname + '/data/data';
            (!fs.existsSync(file)) ? fs.writeFile(file, JSON.stringify(results), function(err) {
                callback(err,null);
            }) : callback(err,null);
        },
    ],function(err,result){
        let file = __dirname + '/data/data';
        if((err === MESSAGE.GET_DATA_ERROR || err === MESSAGE.REQUEST_TIME_OUT) && fs.existsSync(file)) {
            results = JSON.parse(fs.readFileSync(file));
            err = null;
        }
        if (err) res.json({status: false, message: err});
        else res.json({ status: true , result: results });
    })
});
router.post("/getData",function(req,res,next){
    const params=req.body;
    var PARAM_IS_VALID={};
    var results={};
    var htmldata=null;
    var err=null;
    async.series([
        function(callback){
            PARAM_IS_VALID["year_id"]           =   params.year ? Number(params.year)               : err = MESSAGE.PARAM_IS_INVALID;
            PARAM_IS_VALID["semester_id"]       =   params.semester ? Number(params.semester)       : err = MESSAGE.PARAM_IS_INVALID;
            PARAM_IS_VALID['viewstate']         =   fs.readFileSync(__dirname + '/data/viewstatefile'+PARAM_IS_VALID.year_id);
            PARAM_IS_VALID['eventvalidation']   =   fs.readFileSync(__dirname + '/data/eventvalidation'+PARAM_IS_VALID.year_id);
            callback(err,null);
        },
        function(callback){
            var formData = {
                __EVENTTARGET       : 'ctl00$c$droHocki',
                __EVENTARGUMENT     : '',
                __LASTFOCUS         : '',
                __VIEWSTATE         : PARAM_IS_VALID.viewstate,
                __VIEWSTATEGENERATOR: '86C6927F',
                __EVENTVALIDATION   : PARAM_IS_VALID.eventvalidation,
                ctl00$c$txtSearch   : '',
                ctl00$c$droNam      : PARAM_IS_VALID.year_id,
                ctl00$c$droHocki    : PARAM_IS_VALID.semester_id,
            };

            var options = {
                url: 'https://dangkyhoc.thanglong.edu.vn/ToanTruong/TKBToanTruong.aspx',
                method: 'POST',
                form: formData,
                timeout: 6000,
                headers: {'Cookie': cookie}
            };
            request(options, function (error, res, body) {
                if(error && error.code === 'ETIMEDOUT') err = MESSAGE.REQUEST_TIME_OUT;
                else body && body.indexOf('ctl00_c_droNam') > 0 ? 
                    htmldata = body
                : err = MESSAGE.GET_DATA_ERROR;
                callback(err,null);
            });
        },
        function(callback){
            results['years'] = [];
            let data = entities.decode(htmldata.cutString('ctl00_c_droNam', '</select>').trim());
            let year_id = data.match(/[value="]\d+"/g).map(s => s.replace(/"/g , ''));
            let year_title = data.match(/\>(.*?)<\/option>/g).map(s => s.replace('</option>','').replace(/>/ , '').trim());
            year_id ? year_id.map(function (id, i) {
                results.years.push({id: Number(id), title: year_title[i]});
            }) : err = MESSAGE.GET_DATA_SEMESTERS_ERROR;
            callback(err,null);
        },
        function(callback){
            results['semesters'] = [];
            let data = entities.decode(htmldata.cutString('ctl00_c_droHocki', '</select>').trim());
            let semester_id = data.match(/[value="]\d+"/g).map(s => s.replace(/"/g , ''));
            let semester_title = data.match(/Học kỳ(.*?)<\/option>/g).map(s => s.replace('</option>','').trim());
            semester_id ? semester_id.map(function (id, i) {
                results.semesters.push({id: Number(id), title: semester_title[i]});
            }) : err = MESSAGE.GET_DATA_SEMESTERS_ERROR;
            callback(err,null);
        },
        function(callback){
            results['subjects'] = [];
            let data = entities.decode(htmldata.cutString('ctl00_c_gridThoiKhoaiBieuTR', '</table>').trim());
            let td_tag = data.match(/<td>(.*?)<\/td>/g).map(s => s.replace(/<(\/|)td>/g,'').trim());
            let subject = chunk(td_tag, 8);
            td_tag ? subject.map(function (s, i) {
                let shift = s[4].split('-');
                let index = results.subjects.findIndex(function(subject) {return subject.class === s[2]});
                if(index === -1)
                    results.subjects.push({ id              :       s[0],
                                            name            :       s[1],
                                            class           :       s[2],
                                            time            :       [{  day         : Number(s[3]),
                                                                        shift_start : Number(shift[0]),
                                                                        shift_end   : Number(shift[1]),
                                                                    }],
                                            room            :       s[5],
                                            credits         :       Number(s[6]),
                                            lecturer        :       s[7],
                                            checked         :       0,
                                        });
                else{
                    let indexDay = results.subjects[index].time.findIndex(function(time) {return time.day === Number(s[3])});
                    if(indexDay !== -1 && results.subjects[index].time[indexDay].shift_end === Number(shift[0])-1)
                        results.subjects[index].time[indexDay].shift_end = Number(shift[1]);
                    else
                        results.subjects[index].time.push({
                            day         : Number(s[3]),
                            shift_start : Number(shift[0]),
                            shift_end   : Number(shift[1]),
                        });
                }
            }) : err = MESSAGE.GET_DATA_SUBJECTS_ERROR;
            callback(err,null);
        },
        function(callback){
            results.subjects.map((subject,i)=>{
                let subjectClass = subject.class;
                if(subjectClass.indexOf('(L.CHON)') !== -1)
                    subjectClass = subjectClass.replace('(L.CHON)','').replace(' ','');

                let subjectBT = subjectClass.match(/([A-Z]\w+)\.((\d)(\.\d)?)_BT/);
                if(subjectBT){
                    let nameSubjectLT = subjectBT[1]+'.'+subjectBT[3]+'_LT';
                    let indexSubjectLT = results.subjects.findIndex(subject => subject.class.indexOf(nameSubjectLT)!==-1);
                    if(indexSubjectLT !== -1) results.subjects[i]['classLT'] = {
                        class           :       results.subjects[indexSubjectLT].class,
                        time            :       results.subjects[indexSubjectLT].time,
                        room            :       results.subjects[indexSubjectLT].room,
                        lecturer        :       results.subjects[indexSubjectLT].lecturer
                    }
                }
            });
            callback(null,null);
        },
        function(callback){
            const subjectLT = results.subjects.filter(subject => subject.class.match(/([A-Z]\w+)\.(\d)_LT/g));
            subjectLT.forEach(subject=>{
                let indexSubjectLT = results.subjects.findIndex(obj => obj.class.indexOf(subject.class)!==-1);
                if(indexSubjectLT !== -1) results.subjects.splice(indexSubjectLT, 1);
            });
            callback(null,null);
        },
        function(callback){
            for (let i = 0; i < results.subjects.length; i++)
                results.subjects[i]['no'] = i;
            callback(null,null);
        },
        function(callback){
            let file = __dirname + '/data/data'+PARAM_IS_VALID.year_id+PARAM_IS_VALID.semester_id;
            (!fs.existsSync(file)) ? fs.writeFile(file, JSON.stringify(results), function(err) {
                callback(err,null);
            }) : callback(err,null);
        },
    ],function(err,result){
        let file = __dirname + '/data/data'+PARAM_IS_VALID.year_id+PARAM_IS_VALID.semester_id;
        if((err === MESSAGE.GET_DATA_ERROR || err === MESSAGE.REQUEST_TIME_OUT) && fs.existsSync(file)) {
            results = JSON.parse(fs.readFileSync(file));
            err = null;
        }
        if (err) res.json({status: false, message: err});
        else res.json({ status: true , result: results });
    })
});

app.use(router);
app.use(function(err,req,res,next){
	if (!module.parent) console.error(err.stack);
	  // error page
	res.status(500).send({error: '5xx'});
});

app.use(function(req, res, next){
    res.status(404).send({error: '404'});
});

if(!module.parent){
  app.listen(3001, () => console.log('Example app listening on port 3001!'));
}