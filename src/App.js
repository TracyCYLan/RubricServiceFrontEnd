import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from "./component/Layout";
import ListRubricComponent from "./component/rubric/ListRubricComponent";
// import SearchRubricComponent from "./component/criterion/SearchRubricComponent";
import GetRubricComponent from "./component/rubric/GetRubricComponent";
import AddRubricComponent from "./component/rubric/AddRubricComponent";
import ListCriteriaComponent from "./component/criterion/ListCriterionComponent";
import GetCriterionComponent from "./component/criterion/GetCriterionComponent";
// import SearchCriterionComponent from "./component/criterion/SearchCriterionComponent";
import AddCriteriaComponent from "./component/criterion/AddCriterionComponent";
import EditCriteriaComponent from "./component/criterion/EditCriterionComponent";
import ListTagComponent from "./component/tag/ListTagComponent";
import GetTagComponent from "./component/tag/GetTagComponent";
import NavBar from "./component/NavigationBar";
import TestComponent from "./component/TestComponent";
function App() {
    return (
        <React.Fragment>
            <Router>
                <NavBar />
                <Layout>
                    <Switch>
                        <Route path="/" exact component={ListCriteriaComponent} />
                        <Route path="/rubrics" component={ListRubricComponent} />
                        <Route path="/rubric" exact component={GetRubricComponent} />
                        <Route path="/add-rubric" component={AddRubricComponent} />
                        <Route path="/criteria" exact component={ListCriteriaComponent} />
                        <Route path="/add-criterion" component={AddCriteriaComponent} />
                        <Route path="/edit-criterion" component={EditCriteriaComponent} />
                        <Route path="/criterion" exact component={GetCriterionComponent} />
                        {/* <Route path="/criterion/search" component={SearchCriterionComponent} /> */}
                        <Route path="/tags" exact component={ListTagComponent} />
                        <Route path="/tag"  component={GetTagComponent} />
                        <Route path="/test" exact component={TestComponent} />
                    </Switch>
                </Layout>
            </Router>
        </React.Fragment>
    );
}


export default App;
