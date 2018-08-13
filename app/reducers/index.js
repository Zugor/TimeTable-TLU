import { combineReducers } from "redux";
import { schoolTimeTable, schoolTimeTableFilter, checkedClass, time } from "./subject.reducer";

const rootReducer=combineReducers({
    schoolTimeTable,
    schoolTimeTableFilter,
    checkedClass,
    time,
});
export default rootReducer;