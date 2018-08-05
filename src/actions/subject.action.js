import { subjectConstants } from "../constants";
import { subjectService } from "../services";
import { subjectType } from "../data/subject"

export const subjectActions={
    getSubjects,
    getSubjectsWithSemester,
    filterSubjects,
    resetTickSubjects,
    tickCheckBoxSubject,
    messageTimeTable,
}
function getSubjects(){
    return dispatch=>{
        dispatch(request());
        subjectService.getSubjects()
            .then(
                subjects   =>  dispatch(success(subjects)),
                error   =>  dispatch(failure(error))
        )
    }
    function request() { return { type : subjectConstants.GET_SUBJECTS_REQUEST }}
    function success(subjects){ return { type: subjectConstants.GET_SUBJECTS_SUCCESS, subjects }}
    function failure(error) { return { type: subjectConstants.GET_SUBJECTS_FAILURE, error }}
}
function getSubjectsWithSemester(year, semester){
    return dispatch=>{
        dispatch(request());
        subjectService.getSubjectsWithSemester(year, semester)
            .then(
                subjects   =>  dispatch(success(subjects)),
                error   =>  dispatch(failure(error))
        )
        dispatch(resetFilterSubjects());
        dispatch(resetTimeTable());
    }
    function request() { return { type : subjectConstants.GET_SUBJECTS_WITH_SEMESTER_REQUEST }}
    function success(subjects){ return { type: subjectConstants.GET_SUBJECTS_WITH_SEMESTER_SUCCESS, subjects }}
    function failure(error) { return { type: subjectConstants.GET_SUBJECTS_WITH_SEMESTER_FAILURE, error }}
    function resetFilterSubjects() { return { type: subjectConstants.RESET_FILTER_SUBJECT }}
    function resetTimeTable() { return { type: subjectConstants.RESET_TIMETABLE }}
}
function filterSubjects(tab, subjects){
    return dispatch=>{
        dispatch(request(tab, subjects));
    }
    function request(tab, subjects) {
        switch(tab) {
            case 'daicuong': case 'theduc':
                if(subjects) subjects = subjects.filter(function(subject) {
                    return subjectType[tab].indexOf(subject.id) !== -1;
                });
                break;
            case 'dachon':
                if(subjects) subjects = subjects.filter(function(subject) {
                    return subject.checked === 1;
                });
                break;
            case 'ganday':

                break;
            default:
        }
        return { type: subjectConstants.FILTER_SUBJECT, tab, subjects }
    };
}
function resetTickSubjects(){
    return dispatch=>{
        dispatch(request());
        dispatch(resetTimeTable());
    }
    function request() {
        return { type: subjectConstants.RESET_TICK_SUBJECT }
    }
    function resetTimeTable() {
        return { type: subjectConstants.RESET_TIMETABLE }
    }
}
function tickCheckBoxSubject(no, classes){
    return dispatch=>{
        dispatch(request(no));
        dispatch(updateTimeTable(classes));
    }
    function request(no) {
        return { type: subjectConstants.TICK_CHECKBOX_SUBJECT, no }
    }
    function updateTimeTable(classes) {
        return { type: subjectConstants.UPDATE_TIMETABLE, classes }
    }
}
function messageTimeTable(message){
    return dispatch=>{
        dispatch(request(message));
    }
    function request(message) {
        return { type: subjectConstants.MESSAGE_TIMETABLE, message }
    };
}