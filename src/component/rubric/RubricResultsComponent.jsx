import  { Component } from 'react'; //React,
import ApiService from "../../service/ApiService";

class RubricResultsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroups:[],
            rubricId: window.sessionStorage.getItem("rubricId")
        }
    }

    componentDidMount() {
        // direct to list AssessmentGroup page which only shows AssessmentGroups using this rubric
        ApiService.fetchAssessmentGroupsByRubric(this.state.rubricId).then((res)=>{
            this.setState({
                assessmentGroups: res.data
            })
        })
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return '';
    }

}

export default RubricResultsComponent;