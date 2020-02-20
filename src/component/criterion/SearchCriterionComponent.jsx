import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
class SearchCriterionComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            criteria: [],
            message: null,
            searchingText:''
        }
    }

    componentDidMount() {
        
    }

    onChange = (e) =>
    this.setState({ [e.target.name]: e.target.value });

    getCriterion(id){
        window.localStorage.setItem("criterionId",id);
        this.props.history.push('/criterion');
    }
    search = (e) => {
        e.preventDefault();
        ApiService.searchCriterion(this.state.searchingText)
            .then(res => {
                this.setState({ criteria: res.data })
            });
    }
                
    render() {
        return (
            <div>
                <h2 className="text-center">Search Criterion</h2>
                <form>
                <input type="text" name="searchingText" className="form-control" value={this.state.searchingText} onChange={this.onChange} />
                <Button onClick={this.search}>Search</Button>
                </form>
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

export default SearchCriterionComponent;