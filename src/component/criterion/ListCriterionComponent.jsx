import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
class ListCriterionComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            criteria: [],
            message: null
        }
        this.deleteCriterion = this.deleteCriterion.bind(this);
        this.addCriterion = this.addCriterion.bind(this);
        this.reloadCriterionList = this.reloadCriterionList.bind(this);
    }

    componentDidMount() {
        this.reloadCriterionList();
    }

    reloadCriterionList() {
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({ criteria: res.data })
            });
    }

    deleteCriterion(criterionId) {
        ApiService.deleteCriterion(criterionId)
            .then(res => {
                this.setState({ message: 'Criterion deleted successfully.' });
                this.setState({ criteria: this.state.criteria.filter(c => c.id !== criterionId) });
            })

    }

    getCriterion(id){
        window.localStorage.setItem("criterionId",id);
        this.props.history.push('/criterion');
    }
    addCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push('/add-criterion');
    }

                
    render() {
        return (
            <div>
                <h2 className="text-center">All Criteria</h2>
                <Button variant="light" onClick={() => this.addCriterion()}>Add Criterion</Button>
                <Table responsive="lg" bg="gray" hover="true" bordered="true">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>View</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.criteria.map(
                                criterion =>
                                    <tr key={criterion.id}>
                                        <td>{criterion.name}</td>
                                        <td>{criterion.description}</td>
                                        <td><Button variant="info" onClick={() => this.getCriterion(criterion.id)}>View</Button></td>
                                        <td><Button variant="info" onClick={() => this.deleteCriterion(criterion.id)}>Delete</Button></td>
                                    </tr>
                            )
                        }
                    </tbody>
                </Table>

            </div>
        );
    }

}

export default ListCriterionComponent;