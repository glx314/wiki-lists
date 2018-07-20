import * as React from "react";
import { Provider } from 'react-redux';

import { default as store } from './redux';
import HomepageLayout from "./components/homepage";
import * as testRT from "./components/test.rt";

console.log(process.env.NODE_ENV);

export default function() {
    return (
        <Provider store={store}>
            <HomepageLayout/>
        </Provider>
    );
};
