import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import Posts from "../pageComponents/Posts";
class ListAssessmentGroupsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            assessmentGroups: [],
            loading: false,
            searchingText: '',
            resizeVar: true //dummy value for detecting if window resize
        }
        this.reloadList = this.reloadList.bind(this);
        this.getAssessmentGroup = this.getAssessmentGroup.bind(this);
        this.search = this.search.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        this.reloadList();
        window.addEventListener('resize', this.handleWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }
    handleWindowResize() {
        this.setState({ resizeVar: true })
    }
    reloadList() {
        // this.setState({ loading: true }); //if this line is not commented. the whole page will refresh somehow
        ApiService.fetchAssessmentGroups()
            .then((res) => {
                this.setState({
                    assessmentGroups: res.data,
                    loading: false
                })
            });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length === 0) {
            this.reloadList();
        }
    }
    getAssessmentGroup(id) {
        window.sessionStorage.setItem("assessmentGroupId", id);
        this.props.history.push('/assessmentGroup');
    }

    search = (e) => {
        this.setState({ searchingText: this.state.searchingText.trim() })
        if (this.state.searchingText.length === 0) {
            this.reloadList();
        }
        else {
            ApiService.searchAssessmentGroup(this.state.searchingText)
                .then(res => {
                    this.setState({ assessmentGroups: res.data })
                });
        }
    }
    clearSearchBox = (e) => {
        this.setState({ searchingText: "" });
        this.reloadList();
    }

    render() {
        return (<div key="divKey">
            {
                !this.state.loading ?
                    [<h2 key="h2Key" className="text-center mt-3">All AssessmentGroups</h2>,
                    <Row key="row">
                        <Col lg={8} md={10}>
                            
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
                        posts={this.state.assessmentGroups}
                        loading={this.state.loading}
                        get={this.getAssessmentGroup}
                        category='assessmentGroup' />
                    ] : <h2>Loading...</h2>
            }</div>);
    }

}

export default ListAssessmentGroupsComponent;