import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import Posts from "../pageComponents/Posts";
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
class ListRubricComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            rubrics: [],
            message: null,
            loading: false,
            searchingText: ''
        }
        this.addRubric = this.addRubric.bind(this);
        this.reloadRubricList = this.reloadRubricList.bind(this);
        this.editRubric = this.editRubric.bind(this);
        this.copyneditRubric = this.copyneditRubric.bind(this);
        this.getRubric = this.getRubric.bind(this);
        this.search = this.search.bind(this);
        this.exportPage = this.exportPage.bind(this);
    }

    componentDidMount() {
        this.reloadRubricList();
    }

    reloadRubricList() {
        // this.setState({ loading: true }); //if this line is not commented. the whole page will refresh somehow
        ApiService.fetchRubrics()
            .then((res) => {
                this.setState({
                    rubrics: res.data,
                    loading: false
                })
            });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length === 0) {
            this.reloadRubricList();
        }
    }
    getRubric(id) {
        window.sessionStorage.setItem("rubricId", id);
        this.props.history.push('/rubric');
    }

    editRubric(id) {
        if(aliceObj)
        {
            window.sessionStorage.setItem("rubricId", id);
            this.props.history.push('/edit-rubric');
        }
        else
            alert('You need to login')
    }

    publishRubric = (id) => {
        if(aliceObj)
        {
            ApiService.publishRubric(id).then(res =>
                this.setState({
                    rubrics: this.state.rubrics.map(r => {
                        if (r.id === id)
                            return { ...r, publishDate: new Date(), published:true }
                        return r
                    })
                })
            );
        }
        else
            alert('You need to login')
    }
    copyneditRubric(rubric) {
        //send exactly the same content to add-rubric
        if(aliceObj)
        {
            this.props.history.push(
                {
                    pathname: '/add-rubric',
                    state: {
                        name: rubric.name + "_copy",
                        description: rubric.description,
                    }
                }
            );
        }
        else
            alert('You need to login')
    }
    addRubric() {
        if(aliceObj)
        {
            window.sessionStorage.removeItem("rubricId");
            this.props.history.push('/add-rubric');
        }
        else
            alert('You need to Login');
    }

    //direct to export page along with rubric Id
    exportPage = (id) => {
        window.sessionStorage.setItem("rubricId", id);
        this.props.history.push('/export-rubric');
    }

    search = (e) => {
        this.setState({ searchingText: this.state.searchingText.trim() })
        if (this.state.searchingText.length === 0) {
            this.reloadRubricList();
        }
        else {
            ApiService.searchRubric(this.state.searchingText)
                .then(res => {
                    this.setState({ rubrics: res.data })
                });
        }
    }
    clearSearchBox = (e) => {
        this.setState({ searchingText: "" });
        this.reloadRubricList();
    }

    render() {
        return (<div key="divKey">
            {
                !this.state.loading ?
                    [<h2 key="h2Key" className="text-center mt-3">All Rubrics</h2>,
                    <Row key="row">
                        <Col lg={8} md={10}>
                            <Button variant="outline-secondary" onClick={() => this.addRubric()}>Add Rubric</Button>
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
                    <Posts
                        key="posts"
                        posts={this.state.rubrics}
                        loading={this.state.loading}
                        edit={this.editRubric}
                        copynedit={this.copyneditRubric}
                        get={this.getRubric}
                        publishPost={this.publishRubric}
                        exportPage={this.exportPage}
                        category='rubric' />
                    ] : <h2>Loading...</h2>
            }</div>);
    }

}

export default ListRubricComponent;