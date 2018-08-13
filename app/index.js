import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import store from "./store/store";
import Application from "./app";
require('./custom.scss');

render(
    <Provider store={store} > 
        <Application/>
    </Provider>,
    document.getElementById("root")
);
