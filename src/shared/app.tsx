import * as React from "react";
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import {CREATE_DB_PATH, LOGIN_PAGE_PATH, PROFILE_PAGE_PATH, RECORDS_PATH} from "./api";
import {GlobalContextProps, GlobalContextProvider} from "./jsx/context/global-context";
import {NotFoundPage} from "./jsx/pages/not-found";
import {HomePage} from "./jsx/pages/home";
import {DbPageSwitch} from "./jsx/pages/db/db-page-switch";
import {withAsyncImport} from "./jsx/async/async-import-component";
import {LoginPage} from "./jsx/pages/login";
import {ProfilePage} from "./jsx/pages/profile";


// Async components
const AddDbPageAsync = withAsyncImport(() => {
    return import(/* webpackChunkName: "add-db" */ "./jsx/pages/add-db").then((module) => module.default);
});

/** Global app for single db  */
export const App : React.SFC<GlobalContextProps> = (props) => {

    let _ = props.messages;

    return <Provider store={props.store} >

            <GlobalContextProvider {...props}>

                    <Switch>

                        <Route exact path="/" component={HomePage} />
                        <Route exact path={CREATE_DB_PATH} component={AddDbPageAsync} />
                        <Route exact path={LOGIN_PAGE_PATH} component={LoginPage} />
                        <Route exact path={PROFILE_PAGE_PATH} component={ProfilePage} />
                        <Route path={RECORDS_PATH} component={DbPageSwitch} />

                        <Route component={NotFoundPage} />

                    </Switch>

            </GlobalContextProvider>

        </Provider>
};

