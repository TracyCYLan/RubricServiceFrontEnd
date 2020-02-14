import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from "./component/Layout";
import ListRubricComponent from "./component/rubric/ListRubricComponent";
import AddRubricComponent from "./component/rubric/AddRubricComponent";
import EditRubricComponent from "./component/rubric/EditRubricComponent";
import ListCriteriaComponent from "./component/criterion/ListCriterionComponent";
import GetCriteriaComponent from "./component/criterion/GetCriterionComponent";
import AddCriteriaComponent from "./component/criterion/AddCriterionComponent";
import EditCriteriaComponent from "./component/criterion/EditCriterionComponent";
import NavBar from "./component/NavigationBar";
function App() {
    return (
        <React.Fragment>
            <Router>
                <NavBar />
                <Layout>
                    <Switch>
                        <Route path="/" exact component={ListCriteriaComponent} />
                        <Route path="/rubrics" component={ListRubricComponent} />
                        <Route path="/add-rubric" component={AddRubricComponent} />
                        <Route path="/edit-rubric" component={EditRubricComponent} />
                        <Route path="/criteria" exact component={ListCriteriaComponent} />
                        <Route path="/criteria" component={GetCriteriaComponent} />
                        <Route path="/add-criterion" component={AddCriteriaComponent} />
                        <Route path="/edit-criterion" component={EditCriteriaComponent} />
                    </Switch>
                </Layout>
            </Router>
        </React.Fragment>
    );
}


export default App;
