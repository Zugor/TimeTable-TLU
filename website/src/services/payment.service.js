import { authHeader } from "../store";
export const paymentService= {
    checkSentOTP,
    checkOTPverifyMobile,
}
const api={
    checkSentOTP             :"/payment/checkSendOTP",
    checkOTPverifyMobile     :"/payment/checkOTP",
}

function checkSentOTP(user_id, phone){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({id: user_id, phone: phone})
    }
    return fetch(api.checkSentOTP,requestOptions).then(handleResponse);
}
function checkOTPverifyMobile(user_id, phone, otp){
    const requestOptions={
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({id: user_id, phone: phone, otp: otp})
    }
    return fetch(api.checkOTPverifyMobile,requestOptions).then(handleResponse);
}

function handleResponse(response){
    if(!response.ok){
        return Promise.reject(response.statusText);
    }
    return response.json();
    
}