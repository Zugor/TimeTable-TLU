import { combineReducers } from "redux";
import { schoolTimeTable, schoolTimeTableFilter, checkedClass } from "./subject.reducer";

const rootReducer=combineReducers({
    schoolTimeTable,
    schoolTimeTableFilter,
    checkedClass,
});
export default rootReducer;