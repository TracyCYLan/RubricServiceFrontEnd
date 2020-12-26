import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, Card, Badge, CardGroup, Modal, Breadcrumb } from 'react-bootstrap';
import Rating from '../RatingCards/RatingView';
import ReactHtmlParser from 'react-html-parser';
const decode = require('jwt-claims');
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
class GetCriterionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            ratings: [],
            message: '',
            published: '',
            publishDate: '',
            tags: [],
            showModal: false,
            allowEdit: false
        }
        this.loadCriterion = this.loadCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
        this.deleteCriterion = this.deleteCriterion.bind(this);
    }

    componentDidMount() {
        this.loadCriterion();
    }

    loadCriterion() {
        ApiService.fetchCriterionById(window.sessionStorage.getItem("criterionId"))
            .then((res) => {
                let criterion = res.data;
                let temp = false;
                if (aliceObj) {
                    var claims = decode(JSON.parse(aliceObj)['id_token']);
                    if (claims) {
                        var sub = claims['sub'];
                        if (res.data && res.data.creator && sub === res.data.creator.sub)
                            temp = true;
                    }
                }
                this.setState({
                    id: criterion.id,
                    name: criterion.name,
                    description: criterion.description,
                    ratings: criterion.ratings,
                    published: criterion.published,
                    publishDate: criterion.publishDate,
                    tags: criterion.tags,
                    allowEdit: temp
                })
            });
    }
    copyneditCriterion(id) {
        if (aliceObj) {
            window.sessionStorage.setItem("criterionId", id);
            //send exactly the same content to add-criterion
            this.props.history.push(
                {
                    pathname: '/add-criterion',
                    state: {
                        name: this.state.name + "_copy",
                        description: this.state.description,
                        ratings: this.state.ratings,
                        // published: this.state.published,
                        // publishDate: this.state.publishDate,
                        tags: this.state.tags.map(t => t.value)//send only string array
                    }
                }
            );
        }
        else
            alert('You need to login!');
    }
    editCriterion(id) {
        if (aliceObj) {
            if (this.state.allowEdit) {
                window.sessionStorage.setItem("criterionId", id);
                this.props.history.push('/edit-criterion');
            }
            else
                alert('You are not authorized to do the action');
        }
        else
            alert('You need to login!')
    }
    deleteCriterion(id) {
        if (aliceObj) {
            if (this.state.allowEdit) {
                ApiService.deleteCriterion(id)
                    .then(res => {
                        this.setState({ message: 'Criterion deleted successfully.' });
                        this.props.history.push('/criteria');
                    })
            }
            else
                alert('You are not authorized to do the action');
        }
        else
            alert('You need to login')
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            [<Modal key="modal"
                show={this.state.showModal} onHide={() => this.setState({ showModal: false })} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete?</Modal.Title>
                </Modal.Header>
                <Modal.Body>This action will delete the criterion permanently. Click DELETE to continue the action.</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => this.deleteCriterion(this.state.id)}>
                        Delete
                    </Button>
                    <Button variant="outline-secondary" onClick={() => this.setState({ showModal: false })}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>,
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => this.props.history.push('/criteria')}>Criteria</Breadcrumb.Item>
                <Breadcrumb.Item active>{this.state.name}</Breadcrumb.Item>
            </Breadcrumb>,
            <Card key="card" className="mx-auto mt-2">
                <Card.Body>
                    <Card.Title as="h3">{this.state.name}
                        <Button className="float-right" variant="outline-danger ml-1" hidden={this.state.published || !this.state.allowEdit} onClick={() => { this.setState({ showModal: true }) }}>Delete</Button>
                        <Button className="float-right" variant="outline-secondary ml-1" hidden={!this.state.published || !this.state.allowEdit} onClick={() => this.copyneditCriterion(this.state.id)}>Copy</Button>
                        <Button className="float-right" variant="outline-secondary ml-1" hidden={this.state.published || !this.state.allowEdit} onClick={() => this.editCriterion(this.state.id)}>Edit</Button>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {ReactHtmlParser(this.state.description)}
                    </Card.Subtitle>
                    <Card.Text>
                        {
                            this.state.tags.map(
                                function (tag) {
                                    return ([' ', <Badge key={tag.value} variant="secondary">{tag.value}</Badge>])
                                }
                            )
                        }
                    </Card.Text>
                    {
                        <CardGroup>
                            {
                                this.state.ratings.map(
                                    rating =>
                                        <Rating key={rating.id} value={rating.value} index={rating.id}>{rating.description}</Rating>
                                )
                            }
                        </CardGroup>
                    }
                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetCriterionComponent;