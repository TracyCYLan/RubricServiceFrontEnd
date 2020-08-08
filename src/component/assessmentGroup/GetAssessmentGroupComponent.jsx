import React, { Component } from 'react';
import ApiService from "../../service/ApiService";
import { Card, Breadcrumb } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AssessmentGroupInfoTable from './assessmentGroupCards/AssessmentGroupInfoTable';
class GetAssessmentGroupComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroup: '',
            assessments: [],
            rubric: '',
            criteria: [],
            assessmentPeerCount: 0, //count num of peer assessments
            assessmentInstructorCount: 0,//count num of instructor assessments
            ranks: 0,//num of ranks (i.e., the max number of ratings among all criteria) (for stackedbar x-axis)
            InsChartOptionsAvg: '',
            PeerChartOptionsAvg: '',
            InsChartOptionsStacked: '',
            PeerChartOptionsStacked: ''
        }
        this.loadAssessmentGroup = this.loadAssessmentGroup.bind(this);
        this.countRating = this.countRating.bind(this);
    }

    componentDidMount() {
        this.loadAssessmentGroup();
    }

    loadAssessmentGroup() {
        ApiService.fetchAssessmentGroupById(window.sessionStorage.getItem("assessmentGroupId"))
            .then((res) => {
                let assessmentGroup = res.data;
                this.setState({
                    assessmentGroup: assessmentGroup,
                    assessments: assessmentGroup.assessments,
                    rubric: assessmentGroup.rubric,
                    criteria: assessmentGroup.rubric.criteria
                }, () => {
                    this.countRating();
                });
            })
    }
    countRating() {
        this.state.criteria.map(
            c => c.ratings.map(r => {
                r['peer_count'] = 0
                r['instructor_count'] = 0
                return r;
            })
        )
        let peer_count = 0;
        let ins_count = 0;
        let tmpRank = 0;
        for (let assessment of this.state.assessments) {
            if (assessment.type === 'peer_review')
                peer_count++;
            else if (assessment.type === 'grading')
                ins_count++;
            for (let i = 0; i < assessment.ratings.length; i++) {
                let r = assessment.ratings[i]; //current rating in this assessment
                //traverse ratings in certain criterion
                let ratings = this.state.criteria[i].ratings;
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
        this.setState({
            criteria: this.state.criteria,
            assessmentInstructorCount: ins_count,
            assessmentPeerCount: peer_count,
            ranks: tmpRank
        }, () => {
            this.createAvgChart();
            this.createStackedBar();
        })
    }
    createAvgChart() {
        if (this.state.assessmentInstructorCount > 0) {
            let avgData = [];
            for (let i = 0; i < this.state.criteria.length; i++) {
                let criterion = this.state.criteria[i];
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
            let obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Instructor Evaluations - Average points'
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Points'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '<b>{point.y:.1f} points</b>'
                },
                series: [{
                    data: avgData,
                    color: 'rgb(243, 167, 18)',
                    dataLabels: {
                        enabled: true,
                        color: '#545775',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            };
            this.setState({ InsChartOptionsAvg: obj });
        }
        if (this.state.assessmentPeerCount > 0) {
            let avgData = [];
            for (let i = 0; i < this.state.criteria.length; i++) {
                let criterion = this.state.criteria[i];
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
            let obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Peer Evaluations - Average Points'
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Points'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '<b>{point.y:.1f} points</b>'
                },
                series: [{
                    data: avgData,
                    color: 'rgb(243, 167, 18)',
                    dataLabels: {
                        enabled: true,
                        color: '#545775',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            };
            this.setState({ PeerChartOptionsAvg: obj });
        }
    }

    createStackedBar() {
        let colors = ['#008000', '#00ff00', '#fcfc04', '#fcac04', '#d9534f'];
        if (this.state.assessmentInstructorCount > 0) {
            let seriesData = [];
            for (let i = 0; i < this.state.ranks; i++) {
                let arr = [];
                for (let j = 0; j < this.state.criteria.length; j++) {
                    let criterion = this.state.criteria[j];
                    if (i < criterion.ratings.length) {
                        arr = [...arr, criterion.ratings[i].instructor_count];
                    }
                }
                if (i < 5)
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr, color: colors[i], stack: 1 }];
                else
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr }];
            }

            let obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Instructor Evaluations'
                },
                xAxis: {
                    categories: this.state.criteria.map(c => c.name)
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Percent'
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'percent'
                    }
                },
                series: seriesData
            };
            this.setState({ InsChartOptionsStacked: obj });
        }
        if (this.state.assessmentPeerCount > 0) {
            let seriesData = [];
            for (let i = 0; i < this.state.ranks; i++) {
                let arr = [];
                for (let j = 0; j < this.state.criteria.length; j++) {
                    let criterion = this.state.criteria[j];
                    if (i < criterion.ratings.length) {
                        arr = [...arr, criterion.ratings[i].peer_count];
                    }
                }
                if (i < colors.length)
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr, color: colors[i] }];
                else
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr }];
            }
            let obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Peer Evaluations'
                },
                xAxis: {
                    categories: this.state.criteria.map(c => c.name)
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Percent'
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'percent'
                    }
                },
                series: seriesData
            };
            this.setState({ PeerChartOptionsStacked: obj });
        }
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            [<Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item href="assessmentgroups">AssessmentGroups</Breadcrumb.Item>
                <Breadcrumb.Item active>{this.state.assessmentGroup.name}</Breadcrumb.Item>
            </Breadcrumb>,
            <Card key="card" className="mx-auto mt-2">
                <Card.Body>
                    <Card.Title as="h3">{this.state.assessmentGroup.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {ReactHtmlParser(this.state.assessmentGroup.description)}
                    </Card.Subtitle>
                    <Card.Text as="h6">
                        Total {this.state.assessments.length} assessments.
                        </Card.Text>
                    <Card.Text className="text-primary" onClick={() => {
                        window.sessionStorage.setItem("rubricId", this.state.rubric.id);
                        this.props.history.push('/rubric');
                    }}>Using {this.state.rubric.name}</Card.Text>
                    {
                        this.state.assessmentInstructorCount === 0 ? "" :
                            <AssessmentGroupInfoTable assessmentGroup={this.state.assessmentGroup} type="instructor"></AssessmentGroupInfoTable>
                    }
                    {
                        this.state.assessmentPeerCount === 0 ? "" :
                            <AssessmentGroupInfoTable assessmentGroup={this.state.assessmentGroup} type="peer"></AssessmentGroupInfoTable>
                    }
                    {
                        this.state.assessmentInstructorCount === 0 ? "" :
                            [<HighchartsReact
                                key="ins_avgChart"
                                highcharts={Highcharts}
                                options={this.state.InsChartOptionsAvg}
                            />, <br key="space"></br>,
                            <HighchartsReact
                                key="ins_stackedbar"
                                highcharts={Highcharts}
                                options={this.state.InsChartOptionsStacked}
                            />]
                    }
                    {
                        this.state.assessmentPeerCount === 0 ? "" :
                            [<HighchartsReact
                                key="peer_avgChart"
                                highcharts={Highcharts}
                                options={this.state.PeerChartOptionsAvg}
                            />, <br></br>,
                            <HighchartsReact
                                key="peer_stackedbar"
                                highcharts={Highcharts}
                                options={this.state.PeerChartOptionsStacked}
                            />]
                    }
                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetAssessmentGroupComponent;