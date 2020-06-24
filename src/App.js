import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from "./component/Layout";

import ListRubricComponent from "./component/rubric/ListRubricComponent";
import GetRubricComponent from "./component/rubric/GetRubricComponent";
import AddRubricComponent from "./component/rubric/AddRubricComponent";

import ListCriteriaComponent from "./component/criterion/ListCriterionComponent";
import GetCriterionComponent from "./component/criterion/GetCriterionComponent";
import AddCriteriaComponent from "./component/criterion/AddCriterionComponent";
import EditCriterionComponent from "./component/criterion/EditCriterionComponent";

import ListTagComponent from "./component/tag/ListTagComponent";
import GetTagComponent from "./component/tag/GetTagComponent";

import NavBar from "./component/NavigationBar";
import RedirectPage from "./component/RedirectPage";

import AddTaskComponent from "./component/task/AddTaskComponent";

import ImportRubricComponent from "./Canvas/component/ImportRubricComponent";
import ImportCriterionComponent from "./Canvas/component/ImportCriterionComponent";

import LoginComponent from "./component/logins/LoginComponent";
import RegisterComponent from "./component/logins/RegisterComponent";

import TestComponent from "./component/TestComponent";
function App() {
    return (
        <React.Fragment>
            <Router>
                <NavBar key="navbar" />
                <Layout key="layout">
                    <Switch>
                        <Route path="/" exact component={ListCriteriaComponent}/>
                        <Route path="/rubrics" component={ListRubricComponent} />
                        <Route path="/rubric" exact component={GetRubricComponent} />
                        <Route path="/add-rubric" component={AddRubricComponent} />
                        <Route path="/criteria" exact component={ListCriteriaComponent} />
                        <Route path="/add-criterion" component={AddCriteriaComponent} />
                        <Route path="/edit-criterion" component={EditCriterionComponent} />
                        <Route path="/criterion" exact component={GetCriterionComponent} />
                        <Route path="/tags" exact component={ListTagComponent} />
                        <Route path="/tag" component={GetTagComponent} />
                        <Route path="/canvas/getCode/:code" exact render={(props) => {
                            return (
                                <TestComponent code={props.match.params.code} />)
                        }} />
                        <Route path="/add-task" exact component={AddTaskComponent} />
                        <Route path="/import-rubric" exact component={ImportRubricComponent}></Route>
                        <Route path="/import-criterion" exact component={ImportCriterionComponent}></Route>
                        <Route path="/login" exact component={LoginComponent}></Route>
                        <Route path="/register" exact component={RegisterComponent}></Route>
                        <Route path="/redirect" exact component={RedirectPage}></Route>
                    </Switch>
                </Layout>
            </Router>
        </React.Fragment>
    );
}


export default App;
