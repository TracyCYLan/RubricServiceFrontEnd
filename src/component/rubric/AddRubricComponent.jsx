import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, Form, Card } from 'react-bootstrap';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import EditRubricCard from './RubricCards/EditRubricCard';
import ViewRubricCard from './RubricCards/ViewRubricCard';
import EditCriterionCard from './CriterionCards/EditCriterionCard';
import ViewCriterionCard from './CriterionCards/ViewCriterionCard';
class AddRubricComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: '', //rubric id, (will get this value after we click 'next' button to save the rubric)
            name: '',
            description: '',
            publishDate: '',
            newCriterion: '',//new criterion we add by pressing add btn
            suggestionCriteria: [],//for autocomplete
            resetText: true, //will change its value everytime we click import button. this prop will help us to clear the autocomplete field
            importedCriterion: '',//the certain criterion we just select in the autocomplete box
            criteria: [], //criteria which is already existed
            openAutoComplete: false,//open auto complete or not
            showEditCriterion: false,// show edit criterion part or not
            message: null
        }
        this.saveRubric = this.saveRubric.bind(this);
        this.addCriterionBlock = this.addCriterionBlock.bind(this);
        this.deleteCriterionBlock = this.deleteCriterionBlock.bind(this);
        this.importCriterion = this.importCriterion.bind(this);
        this.deleteExistedCriterion = this.deleteExistedCriterion.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOpenAutoComplete = this.handleOpenAutoComplete.bind(this);
        this.editRubric = this.editRubric.bind(this);
        this.backToRubricPage = this.backToRubricPage.bind(this);
    }
    componentDidMount() {
        //if we passed default value to this page: (i.e., copy original one to add)
        if (typeof (this.props.location.state) !== 'undefined') {
            this.setState({
                name: this.props.location.state.name,
                description: this.props.location.state.description,
                criteria: this.props.location.state.criteria
            })
        }
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({
                    suggestionCriteria: res.data
                })
            })
    }
    addCriterionToRubric = (criterionId) => {
        //add criterion to rubric in database
        ApiService.addExistedCriterionUnderRubric(this.state.index, criterionId);
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
    deleteCriterionBlock = () => {
        this.setState({
            newCriterion: ''
        })
    }
    finishUpdateCriterion =(criterionId) =>{
        ApiService.fetchCriterionById(criterionId).then(res=>{
            var criteria=this.state.criteria;
            criteria.map(
                function(c)
                {
                    if(c['id']===criterionId)
                    {
                        c['name']=res.data.name;
                        c['description']=res.data.description;
                        c['ratings']=res.data.ratings;
                        c['view']=true;
                    }
                    return c;
                }
            )
            this.setState({criteria:criteria})
        })

    }
    handleOpenAutoComplete(event, value, reason) {
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
    handleChange(e, value) {
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
            if (!criteria.includes(this.state.importedCriterion)) {
                ApiService.addExistedCriterionUnderRubric(this.state.index, this.state.importedCriterion.id);
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
        ApiService.removeCriterionUnderRubric(this.state.index, criterionId);
    }
    changeToEditCriterion = (criterionId) => {
        var criteria=this.state.criteria;
        criteria.map(
            function(c)
            {
                if(c['id']===criterionId)
                    c['view']=false;
                return c;
            }
        )
        this.setState({criteria:criteria})
    }
    editRubric = (input_name, input_value) => {
        this.setState({
            [input_name]: input_value
        })
    }
    saveRubric = (e) => {
        e.preventDefault();
        let rubric = {
            name: this.state.name,
            description: this.state.description,
            publishDate: this.state.publishDate
        };
        ApiService.addRubric(rubric).then(res => {
            this.setState({
                message: 'Rubric added successfully.',
                showEditCriterion: true,
                index: res.data
            });

        });
    }
    backToRubricPage = (e) => {
        this.props.history.push('/rubrics');
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });


    render() {
        return (
            <Card className="mx-auto mt-3" style={{ width: '95%' }}>
                <Card.Body>
                    <Card.Title>Add Rubric</Card.Title>
                    {!this.state.showEditCriterion ?
                        <EditRubricCard
                            edit={this.editRubric}
                            name={this.state.name}
                            description={this.state.description}
                            publishDate={this.state.publishDate}
                            save={this.saveRubric}></EditRubricCard> :
                        [
                            <ViewRubricCard name={this.state.name} description={this.state.description} publishDate={this.state.publishDate}></ViewRubricCard>,
                            <Card className="mx-auto mt-1">
                                <Card.Body>
                                    <Form>
                                        <Form.Group as={Row} controlId="formGridCriteriaImport">
                                            <Form.Label column lg={2}>Criteria</Form.Label>
                                            <Col md={10}>
                                                <div class="input-group">
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
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formGridEditCriteria">
                                            <Col>
                                                {
                                                    this.state.newCriterion !== '' ?
                                                        <EditCriterionCard
                                                            index={this.state.newCriterion.id}
                                                            name={this.state.newCriterion.name}
                                                            description={this.state.newCriterion.description}
                                                            publishDate={this.state.publishDate}
                                                            ratings={this.state.newCriterion.ratings}
                                                            ratingCount={this.state.newCriterion.ratingCount}
                                                            deleteCriterionBlock={this.deleteCriterionBlock}
                                                            addCriterionToRubric={this.addCriterionToRubric}
                                                            type='new'></EditCriterionCard> : ''
                                                }
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="formGridShowExistedCriterion">
                                            <Col>
                                                {this.state.criteria.map(
                                                    c => typeof (c.view) === 'undefined' ||
                                                        c.view ?
                                                        <ViewCriterionCard
                                                            index={c.id}
                                                            name={c.name}
                                                            description={c.description}
                                                            ratings={c.ratings}
                                                            reusable={c.reusable}
                                                            deleteExistedCriterion={this.deleteExistedCriterion}
                                                            changeToEditCriterion={this.changeToEditCriterion}
                                                        ></ViewCriterionCard> :
                                                        <EditCriterionCard
                                                            index={c.id}
                                                            name={c.name}
                                                            description={c.description}
                                                            publishDate={this.state.publishDate}
                                                            ratings={c.ratings}
                                                            ratingCount='r0'
                                                            deleteCriterionBlock={this.deleteCriterionBlock}
                                                            finishUpdateCriterion={this.finishUpdateCriterion}
                                                            type='update'></EditCriterionCard>
                                                )}
                                            </Col>
                                        </Form.Group>
                                        <div>
                                            <Button variant="outline-secondary" onClick={this.backToRubricPage}>Save</Button> </div>
                                    </Form>
                                </Card.Body>
                            </Card>]}
                </Card.Body>
            </Card>
        );
    }
}

export default AddRubricComponent;