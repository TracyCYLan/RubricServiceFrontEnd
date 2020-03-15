import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, Card, CardGroup, Modal } from 'react-bootstrap';
import RatingV from '../RatingCards/RatingView';
class GetRubricComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            criteria: [],
            message: '',
            published: '',
            publishDate: '',
            showModal: false
        }
        this.loadRubric = this.loadRubric.bind(this);
        this.copyneditRubric = this.copyneditRubric.bind(this);
        this.deleteRubric = this.deleteRubric.bind(this);
    }

    componentDidMount() {
        this.loadRubric();
    }

    loadRubric() {
        ApiService.fetchRubricById(window.localStorage.getItem("rubricId"))
            .then((res) => {
                let rubric = res.data;
                this.setState({
                    id: rubric.id,
                    name: rubric.name,
                    description: rubric.description,
                    criteria: rubric.criteria,
                    published: rubric.published,
                    publishDate: rubric.publishDate
                })
            });
    }
    copyneditRubric(id) {
        window.localStorage.setItem("rubricId", id);
        //send exactly the same content to add-rubric
        //we need to separate criteria into "existed" and "imported"
        let importedCriteria = this.state.criteria.filter(criterion => criterion.reusable === true);
        let criteria = this.state.criteria.filter(criterion =>criterion.reusable === false);
        this.props.history.push(
            {
                pathname: '/add-rubric',
                state: {
                    name: this.state.name + "_copy",
                    description: this.state.description,
                    criteria: criteria,
                    importedCriteria: importedCriteria
                }
            }
        );
    }
    editRubric(id) {
        window.localStorage.setItem("rubricId", id);
        this.props.history.push('/edit-rubric');
    }
    deleteRubric(id) {
        ApiService.deleteRubric(id)
            .then(res => {
                this.setState({ message: 'Rubric deleted successfully.' });
                this.props.history.push('/rubrics');
            })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            [<Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete?</Modal.Title>
                </Modal.Header>
                <Modal.Body>This action will delete the Rubric permanently. Click DELETE to continue the action.</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => this.deleteRubric(this.state.id)}>
                        Delete
                    </Button>
                    <Button variant="outline-secondary" onClick={() => this.setState({ showModal: false })}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>,
            <Card className="mx-auto mt-2" style={{ width: '95%' }}>
                <Card.Body>
                    <Card.Title as="h3">{this.state.name}
                        <Button className="float-right" variant="outline-danger ml-1" hidden={this.state.published} onClick={() => { this.setState({ showModal: true }) }}>Delete</Button>
                        <Button className="float-right" variant="outline-secondary ml-1" hidden={!this.state.published} onClick={() => this.copyneditRubric(this.state.id)}>Copy</Button>
                        <Button className="float-right" variant="outline-secondary ml-1" hidden={this.state.published} onClick={() => this.editRubric(this.state.id)}>Edit</Button>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.state.description}</Card.Subtitle>
                    {this.state.criteria.map(
                        c => <Card className="mb-2">
                            <Card.Header className="text-primary">
                                {c.name}
                            </Card.Header>
                            <CardGroup>
                                <Card>
                                    <Card.Body>
                                        <Card.Text>{c.description}</Card.Text>
                                    </Card.Body>
                                </Card>
                                <CardGroup>
                                    {c.ratings.map(
                                        rating => <RatingV key={rating.id} value={rating.value} index={rating.id}>{rating.description}</RatingV>
                                    )}
                                </CardGroup>
                            </CardGroup>
                        </Card>
                    )}
                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetRubricComponent;