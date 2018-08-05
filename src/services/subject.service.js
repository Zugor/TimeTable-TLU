export const subjectService= {
    getSubjects,
    getSubjectsWithSemester,
}
const api={
    getSubjects             :"/getData",
}

function getSubjects(){
    const requestOptions={
        method: 'GET'
    }
    return fetch(api.getSubjects,requestOptions).then(handleResponse);
}
function getSubjectsWithSemester(year, semester){
    const requestOptions={
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({year: year, semester: semester})
    }
    return fetch(api.getSubjects,requestOptions).then(handleResponse);
}

function handleResponse(response){
    if(!response.ok){
        return Promise.reject(response.statusText);
    }
    return response.json();
    
}