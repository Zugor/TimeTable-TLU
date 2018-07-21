import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/store";
import App from "./App/App";
render(
    <Provider store={store} > 
        <div>
        <App />
        </div>
    </Provider>,
    document.getElementById("root")
);
