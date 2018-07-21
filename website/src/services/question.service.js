import { authHeader } from "../store";
export const questionService= {
    getQuestion,
    answerQuestion,
    skipQuestion,
    getAnsweredQuestion,
    getQuestionImprove,
    skipQuestionImprove,
    updateAnsweredQuestion,
    deleteAnsweredQuestion,
    answerImproveQuestion,
}
const api={
    getQuestion             :"/question/get",
    getQuestionImprove      :"/question/improve/get",
    skipQuestion            :"/question/get",
    skipQuestionImprove     :"/question/get",
    answerQuestion          :"/question/answer",
    getAnsweredQuestion     :"/question/answered/get",
    updateAnsweredQuestion  :"/question/answered/update",
    deleteAnsweredQuestion  :"/question/answered/delete",
    answerImproveQuestion   :"/question/improve/answer",
}

function getQuestion(user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({id: user_id})
    }
    return fetch(api.getQuestion,requestOptions).then(handleResponse);
}
function getQuestionImprove(user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({id: user_id})
    }
    return fetch(api.getQuestionImprove,requestOptions).then(handleResponse);
}
function skipQuestion(user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({id: user_id})
    }
    return fetch(api.skipQuestion,requestOptions).then(handleResponse);
}
function skipQuestionImprove(user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({id: user_id})
    }
    return fetch(api.skipQuestionImprove,requestOptions).then(handleResponse);
}
function answerQuestion(answer_object, question_id, user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({question_id: question_id, user_id: user_id,...answer_object})
    }
    return fetch(api.answerQuestion,requestOptions).then(handleResponse);
}
function getAnsweredQuestion(user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({id: user_id})
    }
    return fetch(api.getAnsweredQuestion,requestOptions).then(handleResponse);
}
function updateAnsweredQuestion(answer_id, user_id, answer_object){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({answer_id: answer_id, user_id: user_id,...answer_object})
    }
    return fetch(api.updateAnsweredQuestion,requestOptions).then(handleResponse);
}
function deleteAnsweredQuestion(answer_id, user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({answer_id: answer_id, user_id: user_id})
    }
    return fetch(api.deleteAnsweredQuestion,requestOptions).then(handleResponse);
}
function answerImproveQuestion(answer_object, question_id, user_id){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({question_id: question_id, user_id: user_id,...answer_object})
    }
    return fetch(api.answerImproveQuestion,requestOptions).then(handleResponse);
}


function handleResponse(response){
    if(!response.ok){
        return Promise.reject(response.statusText);
    }
    return response.json();
    
}