import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Table, Button} from 'react-bootstrap';
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


    getCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
    }
    addCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push(
            {
                pathname: '/add-criterion',
                state: {
                    name: '',
                    description: '',
                    ratings: [{ id: 'default-id-1', description: 'Exceed Expectations', value: 5 },
                    { id: 'default-id-2', description: 'Meet Expectations', value: 3 },
                    { id: 'default-id-3', description: 'Does not Meet Expectations', value: 0 }],
                    published: '',
                    publishDate: '',
                    tags: []
                }
            }
        );
    }
    searchCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push('/criterion/search');
    }
    copyneditCriterion(criterion) {
        //send exactly the same content to add-criterion
        this.props.history.push(
            {
                pathname: '/add-criterion',
                state: {
                    name: criterion.name + "_copy",
                    description: criterion.description,
                    ratings: criterion.ratings,
                    published: criterion.published,
                    publishDate: criterion.publishDate,
                    tags: criterion.tags.map(t => t.name)//send only string array
                }
            }
        );
    }
    editCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/edit-criterion');
    }
    render() {
        return (
            <div>
                <h2 className="text-center" style={{ marginTop: '1rem' }}>All Criteria</h2>
                <Button variant="outline-secondary" style={{ marginLeft: '1rem' }} onClick={() => this.addCriterion()}>Add Criterion</Button> {' '}
                <Button variant="outline-secondary" onClick={() => this.searchCriterion()}>Search Criterion</Button>
                <Table className="mx-auto" style={{ marginTop: '1rem', width: '95%' }} responsive="lg" hover="true" bordered="true">
                    <thead>
                        <tr>
                            <th style={{ width: '80%' }}>Name</th>
                            <th style={{ width: '10%' }}>Publish</th>
                            <th style={{ width: '10%' }}>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.criteria.map(
                                criterion =>
                                    <tr key={criterion.id}>
                                        <td style={{ width: '80%' }}><span class="text-primary" style={{ cursor: "pointer", fontSize: "20px", fontFamily: "sans-serif" }} onClick={() => this.getCriterion(criterion.id)}>{criterion.name}</span></td>
                                        <td style={{ width: '10%' }}><span>{criterion.published ? "Yes" : "No"}</span></td>
                                        <td style={{ width: '10%' }}>
                                            {criterion.published ?
                                                <Button variant="info" style={{width:'80%',height:'50%'}} onClick={() => this.copyneditCriterion(criterion)}>Copy</Button>
                                                : <Button variant="info" style={{width:'80%',height:'50%'}} onClick={() => this.editCriterion(criterion.id)}>Edit</Button>
                                            }
                                        </td>
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