import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, Form, Card, Modal, Breadcrumb } from 'react-bootstrap';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import EditRubricCard from './RubricCards/EditRubricCard';
import ViewRubricCard from './RubricCards/ViewRubricCard';
import EditCriterionCard from './CriterionCards/EditCriterionCard';
import ViewCriterionCard from './CriterionCards/ViewCriterionCard';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
const decode = require('jwt-claims');
class GetRubricComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            loading: true,//in case we haven't finish loading rubric
            criteria: [],
            message: '',
            published: '',
            publishDate: '',
            newCriterion: '',//new criterion we add by pressing add btn
            suggestionCriteria: [],//for autocomplete
            resetText: true, //will change its value everytime we click import button. this prop will help us to clear the autocomplete field
            openAutoComplete: false,//open auto complete or not
            importedCriterion: '',//the certain criterion we just select in the autocomplete box
            showEditRubricCard: false,//ViewRubricCard or EditRubricCard
            showEditCriterionCard: false,//ViewCriterionCard or EditCriterion
            showModal: false,
            rubric: '',
            allowEdit: false
        }
        this.addCriterionBlock = this.addCriterionBlock.bind(this);
        this.addCriterionToRubric = this.addCriterionToRubric.bind(this);
        this.finishUpdateCriterion = this.finishUpdateCriterion.bind(this);
        this.importCriterion = this.importCriterion.bind(this);
        this.deleteExistedCriterion = this.deleteExistedCriterion.bind(this);

        this.loadRubric = this.loadRubric.bind(this);
        this.copyneditRubric = this.copyneditRubric.bind(this);
        this.deleteRubric = this.deleteRubric.bind(this);
        this.editRubric = this.editRubric.bind(this);
        this.saveRubric = this.saveRubric.bind(this);
        this.publishRubric = this.publishRubric.bind(this);

        this.handleOpenAutoComplete = this.handleOpenAutoComplete.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.onDragEnd = this.onDragEnd.bind(this);

        this.showResults = this.showResults.bind(this);
    }

    componentDidMount() {
        this.loadRubric();
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({
                    suggestionCriteria: res.data
                })
            })
    }

    loadRubric() {
        ApiService.fetchRubricById(window.sessionStorage.getItem("rubricId"))
            .then((res) => {
                let rubric = res.data;
                this.setState({
                    loading: false,
                    id: rubric.id,
                    name: rubric.name,
                    description: rubric.description,
                    criteria: rubric.criteria,
                    published: rubric.published,
                    publishDate: rubric.publishDate === null ? '' : new Date(rubric.publishDate).toLocaleDateString('fr-CA'),
                    rubric: rubric
                })
                let aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service");
                if (aliceObj) {
                    var claims = decode(JSON.parse(aliceObj)['id_token']);
                    var sub = claims['sub'];
                    if (sub === res.data.creator.sub)
                        this.setState({ allowEdit: true })
                }
            });
    }
    copyneditRubric = (id) => {
        window.sessionStorage.setItem("rubricId", id);
        //send exactly the same content to add-rubric
        this.props.history.push(
            {
                pathname: '/add-rubric',
                state: {
                    name: this.state.name + "_copy",
                    description: this.state.description,
                    criteria: this.state.criteria
                }
            }
        );
    }
    editRubric = (input_name, input_value) => {
        this.setState({
            [input_name]: input_value
        })
    }
    cancelEditRubric = (e) => {
        ApiService.fetchRubricById(this.state.id).then(res => {
            let rubric = res.data;
            this.setState({
                loading: false,
                name: rubric.name,
                description: rubric.description,
                published: rubric.published,
                publishDate: rubric.publishDate === null ? '' : new Date(rubric.publishDate).toLocaleDateString('fr-CA'),
                showEditRubricCard: false
            })
        })
    }
    publishRubric = (id) => {
        ApiService.publishRubric(id).then(res =>
            this.setState({
                publishDate: new Date().toLocaleDateString('fr-CA'),
                published: true
            })
        );
    }
    saveRubric = (e) => {
        e.preventDefault();
        let rubric = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description,
            publishDate: this.state.publishDate === '' ? null : this.state.publishDate
        };
        ApiService.editRubric(rubric).then(res => {
            this.setState({
                message: 'Rubric updated successfully.',
                showEditRubricCard: false
            });

        });
    }
    deleteRubric(id) {
        ApiService.deleteRubric(id)
            .then(res => {
                this.setState({ message: 'Rubric deleted successfully.' });
                this.props.history.push('/rubrics');
            })
    }
    addCriterionBlock = () => {
        if (this.state.newCriterion !== '')
            return;
        let newCriterion = {
            id: 'c0',
            name: '',
            description: '',
            ratingCount: 'r0',
            ratings: [{ id: 'id-default-1', description: 'Exceed Expectations', value: 5 },
            { id: 'id-default-2', description: 'Meet Expectations', value: 3 },
            { id: 'id-default-3', description: 'Does not Meet Expectations', value: 0 }],
        };
        this.setState({
            newCriterion: newCriterion,
        });
    }
    addCriterionToRubric = (criterionId) => {
        //add criterion to rubric in database
        ApiService.addExistedCriterionUnderRubric(this.state.id, criterionId);
        ApiService.fetchCriterionById(criterionId).then(res => {
            var criteria = this.state.criteria;
            var criterion = res.data;
            criteria.push({
                id: criterion.id,
                name: criterion.name,
                description: criterion.description,
                ratings: criterion.ratings,
                view: true
            });
            this.setState({
                criteria: criteria,
                newCriterion: ''
            })
        })
    }
    finishUpdateCriterion = (criterionId) => {
        ApiService.fetchCriterionById(criterionId).then(res => {
            var criteria = this.state.criteria;
            criteria.map(
                function (c) {
                    if (c['id'] === criterionId) {
                        c['name'] = res.data.name;
                        c['description'] = res.data.description;
                        c['ratings'] = res.data.ratings;
                        c['view'] = true;
                    }
                    return c;
                }
            )
            this.setState({ criteria: criteria })
        })
    }
    handleOpenAutoComplete = (event, value, reason) => {
        //to deal with open autocomplete or not.
        if (value.length >= 2 && reason === 'input') {
            this.setState({
                openAutoComplete: true
            })
        }
        else {
            this.setState({ openAutoComplete: false })
        }
    }
    handleChange = (e, value) => {
        //handleChange of autocomplete input box
        //value is a Criterion object
        if (value !== null) {
            this.setState({
                importedCriterion: value
            });
        }
    }
    importCriterion = () => {
        //so far allow one criterion exists only once
        //import the autocomplete criterion into array
        if (this.state.importedCriterion === '')
            alert("You need to select a Criterion to import")
        else {
            let criteria = this.state.criteria;
            if (!criteria.some(c => c.id === this.state.importedCriterion.id)) {
                ApiService.addExistedCriterionUnderRubric(this.state.id, this.state.importedCriterion.id);
                criteria.push(this.state.importedCriterion);
                this.setState({
                    criteria: criteria,
                    importedCriterion: '',
                    resetText: !this.state.resetText
                });
            }
            else {
                this.setState({
                    importedCriterion: '',
                    resetText: !this.state.resetText
                })
            }
        }
    }
    deleteExistedCriterion = (criterionId) => {
        this.setState({
            criteria: this.state.criteria.filter(c => c.id !== criterionId)
        })
        ApiService.removeCriterionUnderRubric(this.state.id, criterionId);
    }
    changeToEditCriterion = (criterionId) => {
        var criteria = this.state.criteria;
        criteria.map(
            function (c) {
                if (c['id'] === criterionId)
                    c['view'] = false;
                return c;
            }
        )
        this.setState({ criteria: criteria })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        ApiService.changeCriterionOrderUnderRubric(this.state.id, result.source.index, result.destination.index);
        const criteria = reorder(
            this.state.criteria,
            result.source.index,
            result.destination.index
        );
        this.setState({
            criteria: criteria
        });
    }

    showResults() {
        window.sessionStorage.setItem("rubricId", this.state.id);
        this.props.history.push({ pathname: '/rubric-results', state: { rubric: this.state.rubric } });
    }

    render() {
        return (
            [<Modal key="modal" show={this.state.showModal} onHide={() => this.setState({ showModal: false })} animation={true}>
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
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => this.props.history.push('/rubrics')}>Rubrics</Breadcrumb.Item>
                <Breadcrumb.Item active>{this.state.name}</Breadcrumb.Item>
            </Breadcrumb>,
            <Card key="card" className="mx-auto mt-2">
                <Card.Body>
                    {this.state.loading ? '' :
                        (!this.state.published && this.state.showEditRubricCard) ?
                            <EditRubricCard
                                id={this.state.id}
                                edit={this.editRubric}
                                name={this.state.name}
                                description={this.state.description}
                                publishDate={this.state.publishDate}
                                published={this.state.published}
                                cancel={this.cancelEditRubric}
                                save={this.saveRubric}
                                type='edit'
                            ></EditRubricCard>
                            :
                            <ViewRubricCard
                                id={this.state.id}
                                name={this.state.name}
                                description={this.state.description}
                                publishDate={this.state.publishDate}
                                published={this.state.published || !this.state.allowEdit} //treat it as published if not allow edit
                                preDelete={() => { this.setState({ showModal: true }) }}
                                editRubric={() => {this.setState({ showEditRubricCard: true })}}
                                copyneditRubric={() => this.copyneditRubric(this.state.id)}
                                publishRubric={() => this.publishRubric(this.state.id)}
                                showResults={() => this.showResults(this.state.id)}
                                type='view'>
                            </ViewRubricCard>
                    }
                    <Card className="mx-auto mt-1">
                        <Card.Body>
                            {this.state.published || !this.state.allowEdit ?//if it's published, just show all criteria
                                <Form>
                                    <Form.Group as={Row} controlId="formGridShowExistedCriterion">
                                        <Col>
                                            {this.state.criteria.map(
                                                c => <ViewCriterionCard key={c.id} index={c.id} name={c.name} description={c.description} ratings={c.ratings}
                                                    reusable={c.reusable} published={this.state.published || !this.state.allowEdit}
                                                    deleteExistedCriterion={() => this.deleteExistedCriterion(c.id)}
                                                    changeToEditCriterion={this.changeToEditCriterion} ></ViewCriterionCard>)}
                                        </Col>
                                    </Form.Group>
                                </Form>
                                ://if not published yet, allow to add and edit
                                <Form>
                                    <Form.Group as={Row}>
                                        <Col>
                                            <Button variant="info" className="float-right"
                                                onClick={() => { this.setState({ showEditCriterionCard: !this.state.showEditCriterionCard }) }}>Add or Import Criterion</Button>
                                        </Col>
                                    </Form.Group>
                                    {this.state.showEditCriterionCard ?//only show import area and editcriterion card when we click addorimport button
                                        [<Form.Group as={Row} controlId="formGridCriteriaImport" key="importCriterion">
                                            <Form.Label column lg={2}>Criteria</Form.Label>
                                            <Col md={10}>
                                                <div className="input-group">
                                                    <Autocomplete
                                                        key={this.state.resetText}
                                                        onInputChange={this.handleOpenAutoComplete}
                                                        open={this.state.openAutoComplete}
                                                        options={this.state.suggestionCriteria}
                                                        getOptionLabel={option => option.name}
                                                        style={{ width: 300 }}
                                                        onChange={this.handleChange}
                                                        renderInput={params =>
                                                            <TextField {...params}
                                                                variant="outlined"
                                                                onChange={this.handleChange}
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            />}
                                                    />
                                                    <Button variant="outline-info ml-2 mt-2" style={{ height: '80%' }} onClick={this.importCriterion}>Import</Button>
                                                </div>
                                            </Col>
                                            <Button variant="outline-info ml-2" onClick={this.addCriterionBlock}>Add new Criterion</Button>
                                        </Form.Group>,
                                        <Form.Group as={Row} controlId="formGridEditCriteria" key="editCriteria">
                                            <Col>
                                                {
                                                    this.state.newCriterion === '' ? '' :
                                                        <EditCriterionCard
                                                            index={this.state.newCriterion.id}
                                                            name={this.state.newCriterion.name}
                                                            description={this.state.newCriterion.description}
                                                            publishDate={this.state.publishDate}
                                                            ratings={this.state.newCriterion.ratings}
                                                            ratingCount={this.state.newCriterion.ratingCount}
                                                            deleteCriterionBlock={() => this.setState({ newCriterion: '' })}
                                                            addCriterionToRubric={this.addCriterionToRubric}
                                                            type='new'></EditCriterionCard>
                                                }
                                            </Col>
                                        </Form.Group>
                                        ] : <div></div>}
                                    <Form.Group as={Row} controlId="formGridShowExistedCriterion">
                                        <Col>
                                            <DragDropContext onDragEnd={this.onDragEnd}>
                                                <Droppable droppableId="droppable">
                                                    {(provided, snapshot) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            {this.state.criteria.map((c, index) => (
                                                                <Draggable key={c.id + ''} draggableId={c.id + ''} index={index}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            {typeof (c.view) === 'undefined' ||
                                                                                c.view ?
                                                                                <ViewCriterionCard
                                                                                    key={c.id}
                                                                                    index={c.id}
                                                                                    name={c.name}
                                                                                    description={c.description}
                                                                                    ratings={c.ratings}
                                                                                    reusable={c.reusable}
                                                                                    published={this.state.published}
                                                                                    deleteExistedCriterion={() => this.deleteExistedCriterion(c.id)}
                                                                                    changeToEditCriterion={this.changeToEditCriterion}
                                                                                ></ViewCriterionCard> :
                                                                                <EditCriterionCard
                                                                                    key={c.id}
                                                                                    index={c.id}
                                                                                    name={c.name}
                                                                                    description={c.description}
                                                                                    publishDate={this.state.publishDate}
                                                                                    ratings={c.ratings}
                                                                                    ratingCount='r0'
                                                                                    deleteCriterionBlock={() => this.deleteExistedCriterion(c.id)}
                                                                                    finishUpdateCriterion={this.finishUpdateCriterion}
                                                                                    type='update'></EditCriterionCard>
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        </Col>
                                    </Form.Group>
                                    <div>
                                        {this.state.showEditCriterionCard ? <Button variant="outline-secondary" onClick={() => this.setState({ showEditCriterionCard: false })}>Done</Button> : ''}
                                    </div>
                                </Form>
                            }
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>
            ]);
    }

}

export default GetRubricComponent;