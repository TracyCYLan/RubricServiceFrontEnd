import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
class ListRubricComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            rubrics: [],
            message: null
        }
        this.deleteRubric = this.deleteRubric.bind(this);
        this.editRubric = this.editRubric.bind(this);
        this.addRubric = this.addRubric.bind(this);
        this.reloadRubricList = this.reloadRubricList.bind(this);
    }

    componentDidMount() {
        this.reloadRubricList();
    }

    reloadRubricList() {
        ApiService.fetchRubrics()
            .then((res) => {
                this.setState({ rubrics: res.data })
            });
    }

    deleteRubric(rubricId) {
        ApiService.deleteRubric(rubricId)
            .then(res => {
                this.setState({ message: 'Rubric deleted successfully.' });
                this.setState({ rubrics: this.state.rubrics.filter(r => r.id !== rubricId) });
            })

    }

    editRubric(id) {
        window.localStorage.setItem("rubricId", id);
        this.props.history.push('/edit-rubric');
    }

    addRubric() {
        window.localStorage.removeItem("rubricId");
        this.props.history.push('/add-rubric');
    }


    render() {
        return (
            <div>
                <h2 className="text-center">Rubric Details</h2>
                <Button variant="light" onClick={() => this.addRubric()}>Add Rubric</Button>
                <Table responsive="lg" bg="gray" hover="true" bordered="true">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Published</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.rubrics.map(
                                rubric =>
                                    <tr key={rubric.id}>
                                        <td>{rubric.name}</td>
                                        <td>{rubric.description}</td>
                                        <td>{rubric.published?"Yes":"No"}</td>
                                        <td><button className="btn btn-success" onClick={() => this.editRubric(rubric.id)} >Edit</button></td>
                                        <td><button className="btn btn-success" onClick={() => this.deleteRubric(rubric.id)}>Delete</button></td>
                                    </tr>
                            )
                        }
                    </tbody>
                </Table>

            </div>
        );
    }

}

export default ListRubricComponent;