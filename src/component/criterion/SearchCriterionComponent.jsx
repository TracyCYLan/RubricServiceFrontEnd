import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, Container, Row, Col } from 'react-bootstrap';
class SearchCriterionComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            criteria: [],
            message: null,
            searchingText: ''
        }
        this.getCriterion = this.getCriterion.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {

    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    getCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
    }
    search = (e) => {
        // e.preventDefault();
        ApiService.searchCriterion(this.state.searchingText)
            .then(res => {
                this.setState({ criteria: res.data })
            });
    }
    render() {
        return (
            <div>
                <h2 className="text-center" style={{ marginTop: '1rem' }}>Search Criterion</h2>
                <Container>
                    <Row>
                        <Col>
                            <input type="text" name="searchingText" className="form-control"
                                value={this.state.searchingText}
                                onChange={this.onChange}
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        this.search()
                                    }
                                }} />
                        </Col>
                        <Col>
                            <Button variant="outline-secondary" onClick={this.search}>Search</Button>
                        </Col>
                    </Row>
                </Container>
                {this.state.criteria.length > 0 ?
                    <div>
                        <h6 style={{ marginTop: '1rem' }} class="text-primary">{'Found ' + this.state.criteria.length + ' results.'}</h6>
                        <ol>
                        {
                            this.state.criteria.map(
                                criterion =>
                                    <div>
                                        <li>
                                            <span class="text-success" size="lg"
                                                onClick={() => this.getCriterion(criterion.id)}
                                                style={{ cursor: "pointer",fontSize:"20px",fontFamily: "sans-serif" }}>{criterion.name}</span>
                                        </li>
                                    </div>
                            )
                        }
                        </ol>
                    </div>
                    : <h6 style={{ marginTop: '1rem' }} class="text-primary">No Criterion Found.</h6>
                }
            </div>
        );
    }

}

export default SearchCriterionComponent;