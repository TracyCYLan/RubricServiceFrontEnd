import React, { Component } from 'react';
// import ApiService from "../../service/ApiService";
import { Card} from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AssessmentGroupInfoTable from '../assessmentGroup/assessmentGroupCards/AssessmentGroupInfoTable';
class RubricResultsCompareComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroups: this.props.location.state.list,
            rubric: this.props.location.state.rubric,
            InsChartOptionsAvg: '',
            PeerChartOptionsAvg: '',
            InsChartOptionsStacked: '',
            PeerChartOptionsStacked: ''
        }
    }

    componentDidMount() {
        this.countRating();
    }
    countRating() {
        let newAssessmentGroups = [];
        for (var i = 0; i < this.state.assessmentGroups.length; i++) {
            let assessmentGroup = this.state.assessmentGroups[i];
            assessmentGroup.rubric.criteria.map(
                c => c.ratings.map(r => {
                    r['peer_count'] = 0
                    r['instructor_count'] = 0
                    return r;
                })
            )
            let assessments = assessmentGroup.assessments;
            let peer_count = 0;
            let ins_count = 0;
            let tmpRank = 0;
            for (let assessment of assessments) {
                if (assessment.type === 'peer_review')
                    peer_count++;
                else if (assessment.type === 'grading')
                    ins_count++;
                for (let j = 0; j < assessment.ratings.length; j++) {
                    let r = assessment.ratings[j]; //current rating in this assessment
                    //traverse ratings in certain criterion
                    let ratings = assessmentGroup.rubric.criteria[j].ratings;
                    tmpRank = Math.max(tmpRank, ratings.length);//update rank
                    for (let rating of ratings) {
                        if (rating.value === r.value) {
                            if (assessment.type === 'peer_review')
                                rating.peer_count++;
                            else if (assessment.type === 'grading')
                                rating.instructor_count++;
                            break;
                        }
                    }
                }
            }
            assessmentGroup['ins_count'] = ins_count;
            assessmentGroup['peer_count'] = peer_count;
            newAssessmentGroups = [...newAssessmentGroups, assessmentGroup];
        }
        this.setState({
            assessmentGroups: newAssessmentGroups,
        }, () => {
            this.createAvgChart();
            this.createStackedBar();
        })
    }
    createAvgChart() {
        if (this.state.assessmentGroups === '' || this.state.assessmentGroups.length === 0)
            return;
        let ins_series = [], peer_series = [];
        for (let assessmentGroup of this.state.assessmentGroups) {
            let name = new Date(assessmentGroup.assessDate).toLocaleDateString();
            if (assessmentGroup.ins_count > 0) {
                let avgData = [];
                let criteria = assessmentGroup.rubric.criteria
                for (let i = 0; i < criteria.length; i++) {
                    let criterion = criteria[i];
                    let avg = 0;
                    let totalCount = 0;
                    for (let j = 0; j < criterion.ratings.length; j++) {
                        let rating = criterion.ratings[j];
                        avg += (rating.value * rating.instructor_count);
                        totalCount += rating.instructor_count;
                    }
                    criterion['avg'] = avg / totalCount;
                    avgData = [...avgData, [criterion.name, criterion['avg']]];
                }
                ins_series = [...ins_series, { name: name, data: avgData }];
            }
            if (assessmentGroup.peer_count > 0) {
                let avgData = [];
                let criteria = assessmentGroup.rubric.criteria
                for (let i = 0; i < criteria.length; i++) {
                    let criterion = criteria[i];
                    let avg = 0;
                    let totalCount = 0;
                    for (let j = 0; j < criterion.ratings.length; j++) {
                        let rating = criterion.ratings[j];
                        avg += (rating.value * rating.peer_count);
                        totalCount += rating.peer_count;
                    }
                    criterion['avg'] = avg / totalCount;
                    avgData = [...avgData, [criterion.name, criterion['avg']]];
                }
                peer_series = [...peer_series, { name: name, data: avgData }];
            }
        }

        if (ins_series.length > 0) {
            let ins_obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.state.rubric.name + " - " + this.state.assessmentGroups[0].name
                },
                xAxis: {
                    categories: this.state.rubric.criteria.map(c => c.name),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Points'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: ins_series
            }
            this.setState({ InsChartOptionsAvg: ins_obj })
        }

        if (peer_series.length > 0) {
            let peer_obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.state.rubric.name + " - " + this.state.assessmentGroups[0].name
                },
                xAxis: {
                    categories: this.state.rubric.criteria.map(c => c.name),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Points'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: peer_series
            }
            this.setState({ PeerChartOptionsAvg: peer_obj })
        }
    }

    createStackedBar() {

    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return <Card className="mx-auto mt-2">
            <Card.Body>
                {this.state.assessmentGroups.map(
                    a=> <AssessmentGroupInfoTable key="table" assessmentGroup={a} type="instructor"></AssessmentGroupInfoTable>
                )}
                <HighchartsReact
                    key="ins_avgChart"
                    highcharts={Highcharts}
                    options={this.state.InsChartOptionsAvg}
                />
                <HighchartsReact
                    key="peer_avgChart"
                    highcharts={Highcharts}
                    options={this.state.PeerChartOptionsAvg}
                />
            </Card.Body>
        </Card>;
    }

}

export default RubricResultsCompareComponent;