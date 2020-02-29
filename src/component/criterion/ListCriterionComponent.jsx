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


    getCriterion(id){
        window.localStorage.setItem("criterionId",id);
        this.props.history.push('/criterion');
    }
    addCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push(
            {
                pathname: '/add-criterion',
                state:{
                    name:'',
                    description: '',
                    ratings: [{ id: 'default-id-1', description: 'Exceed Expectations', value: 5 },
                    { id: 'default-id-2', description: 'Meet Expectations', value: 3 },
                    { id: 'default-id-3', description: 'Does not Meet Expectations', value: 0 }],
                    published: '',
                    publishDate:'',
                    tags:[]
                }
            }
        );
    }
    searchCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push('/criterion/search');
    }
                
    render() {
        return (
            <div>
                <h2 className="text-center" style={{ marginTop: '1rem'}}>All Criteria</h2>
                <Button variant="outline-secondary" style={{marginLeft:'1rem'}} onClick={() => this.addCriterion()}>Add Criterion</Button> {' '}
                <Button variant="outline-secondary" onClick={() => this.searchCriterion()}>Search Criterion</Button>
                <Table className="mx-auto text-center" style={{ marginTop: '1rem', width: '95%' }} responsive="lg" hover="true" bordered="true">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Publish</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.criteria.map(
                                criterion =>
                                    <tr key={criterion.id}>
                                        <td>{criterion.name}</td>
                                        <td>{criterion.published?"Yes":"No"}</td>
                                        <td><Button variant="info" onClick={() => this.getCriterion(criterion.id)}>View</Button></td>
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