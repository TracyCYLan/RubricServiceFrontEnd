import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import Posts from "../pageComponents/Posts";
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
class ListCriterionComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            criteria: [],
            message: null,
            loading: false,
            searchingText: '',
            resizeVar: true //dummy value for detecting if window resize
        }
        this.addCriterion = this.addCriterion.bind(this);
        this.reloadCriterionList = this.reloadCriterionList.bind(this);
        this.editCriterion = this.editCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
        this.publishCriterion = this.publishCriterion.bind(this);
        this.search = this.search.bind(this);
        this.getTag = this.getTag.bind(this);
        this.exportPage = this.exportPage.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        this.reloadCriterionList();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize() {
        this.setState({ resizeVar: true })
    }
    reloadCriterionList() {
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({
                    criteria: res.data
                })
            });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length === 0) {
            this.reloadCriterionList();
        }
    }
    getCriterion(id) {
        window.sessionStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
    }
    publishCriterion = (id) => {
        if (aliceObj) {
            ApiService.publishCriterion(id).then(res =>
                this.setState({
                    criteria: this.state.criteria.map(c => {
                        if (c.id === id)
                            return { ...c, publishDate: new Date(), published: true }
                        return c
                    })
                })
            );
        }
        else
            alert('You need to login')

    }
    //direct to export page along with criterion Id
    exportPage = (id) => {
        window.sessionStorage.setItem("criterionId", id);
        this.props.history.push('/export-criterion');
    }

    addCriterion() {
        if (aliceObj) {
            window.sessionStorage.removeItem("criterionId");
            this.props.history.push('add-criterion');
        }
        else
            alert('You need to login')
    }
    copyneditCriterion(criterion) {
        //send exactly the same content to add-criterion
        if (aliceObj) {
            this.props.history.push(
                {
                    pathname: '/add-criterion',
                    state: {
                        name: criterion.name + "_copy",
                        description: criterion.description,
                        ratings: criterion.ratings,
                        published: criterion.published,
                        publishDate: criterion.publishDate,
                        tags: criterion.tags.map(t => t.value)//send only string array
                    }
                }
            );
        }
        else
            alert('You need to login')
    }
    editCriterion(id) {
        if (aliceObj) {
            window.sessionStorage.setItem("criterionId", id);
            this.props.history.push('/edit-criterion');
        }
        else
            alert('You need to login')
    }
    search = (e) => {
        this.setState({ searchingText: this.state.searchingText.trim() })
        if (this.state.searchingText.length === 0) {
            this.reloadCriterionList();
        }
        else {
            ApiService.searchCriterion(this.state.searchingText)
                .then(res => {
                    this.setState({ criteria: res.data })
                });
        }
    }
    clearSearchBox = (e) => {
        this.setState({ searchingText: "" });
        this.reloadCriterionList();
    }
    getTag = (id) => {
        window.sessionStorage.setItem("tagId", id);
        this.props.history.push('/tag');
    }
    render() {
        return (<div key="listcriterionDiv">
            {
                [<h2 key="header" className="text-center mt-3">All Criteria</h2>,
                <Row key="row">
                    <Col lg={8} md={10}>
                        <Button variant="outline-secondary" onClick={() => this.addCriterion()}>Add Criterion</Button>
                    </Col>
                    <Col className="mt-1">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Button variant="outline-danger" onClick={this.clearSearchBox}>x</Button>
                            </InputGroup.Prepend>
                            <FormControl name="searchingText"
                                value={this.state.searchingText}
                                onChange={this.onChange}
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        this.search()
                                    }
                                }} />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={this.search}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>,
                <Posts key="posts"
                    posts={this.state.criteria}
                    loading={this.state.loading}
                    edit={this.editCriterion}
                    copynedit={this.copyneditCriterion}
                    get={this.getCriterion}
                    getTag={this.getTag}
                    publishPost={this.publishCriterion}
                    exportPage={this.exportPage}
                    category='criterion' />
                ]
            }</div>);
    }

}

export default ListCriterionComponent;