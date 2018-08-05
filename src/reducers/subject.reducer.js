import { subjectConstants } from "../constants";

export function schoolTimeTable(state={},action){
    
    switch(action.type){
        case subjectConstants.GET_SUBJECTS_REQUEST:
            return {
                loading: true
            }
        case subjectConstants.GET_SUBJECTS_WITH_SEMESTER_REQUEST:
            return {
                loading: true
            }

        case subjectConstants.GET_SUBJECTS_SUCCESS:
            return {
                data: action.subjects
            }
        case subjectConstants.GET_SUBJECTS_WITH_SEMESTER_SUCCESS:
            return {
                data: action.subjects
            }

        case subjectConstants.GET_SUBJECTS_FAILURE:
            return {
                data: {status: false, message: action.error}
            }
        case subjectConstants.GET_SUBJECTS_WITH_SEMESTER_FAILURE:
            return {
                data: {status: false, message: action.error}
            }

        case subjectConstants.TICK_CHECKBOX_SUBJECT:
            if(state.data && state.data.result && state.data.result.subjects[action.no]) state.data.result.subjects[action.no].checked ^= 1;
            return {
                ...state
            }
        case subjectConstants.RESET_TICK_SUBJECT:
            if(state.data && state.data.result && state.data.result.subjects)
                state.data.result.subjects.map((subject, i) => {
                    state.data.result.subjects[i].checked = 0;
                });
            return {
                ...state
            }

        default:
            return state;
    }
    
}

export function schoolTimeTableFilter(state={},action){

    switch(action.type){
        case subjectConstants.FILTER_SUBJECT:
            return {
                tab     : action.tab,
                subjects: action.subjects
            }
        case subjectConstants.RESET_FILTER_SUBJECT:
            return {}
        default:
            return state;
    }
    
}

export function checkedClass(state={},action){

    switch(action.type){
        case subjectConstants.UPDATE_TIMETABLE:
            if(!state.classes) state['classes'] = [];
            if(state.message) delete state.message;
            if(action.classes){
                let index = state.classes.findIndex(function(c) {return c.class === action.classes.class});
                if(index === -1) 
                    state.classes.push(action.classes);
                else
                    state.classes.splice(index, 1);
            }
            else state.classes.push(action.classes);
            return {
                ...state
            }
        case subjectConstants.MESSAGE_TIMETABLE:
            return {
                ...state,
                message :   action.message
            }
        case subjectConstants.RESET_TIMETABLE:
            return {}
        default:
            return state;
    }
    
}