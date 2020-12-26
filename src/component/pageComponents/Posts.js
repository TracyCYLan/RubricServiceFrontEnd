import React from 'react';
import { Button, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
const decode = require('jwt-claims');
const Posts = ({ posts, loading, get, edit, copynedit, getTag, category, publishPost, exportPage }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }
    if (category === 'criterion') {
        return (
            <div key="criteriontableDiv" className="mx-auto mt-2">
                <BootstrapTable
                    bootstrap4
                    keyField="id"
                    key="criteriontable"
                    data={posts}
                    columns={[{
                        dataField: 'name',
                        text: 'Name',
                        headerStyle: (colum, colIndex) => {
                            return { width: '65%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        formatter: (cellContent, row) => {
                            return [<Col key="1" className="text-primary"
                                style={{ cursor: "pointer", fontSize: "22px", fontFamily: "sans-serif" }}
                                onClick={() => get(row.id)}>
                                {row.name}</Col>,
                            <Col key="2" className="ml-2">
                                {row.tags.map(
                                    function (tag) {
                                        return ([' ', <Button key={tag.id} className="mt-1" variant="secondary" size="sm" onClick={() => getTag(tag.id)}>{tag.value}</Button>])
                                    }
                                )}
                            </Col>]
                        },
                        sort: false
                    }, {
                        dataField: 'publishDate',
                        text: 'Publish Date',
                        hidden: !window.matchMedia("screen and (min-width: 992px)").matches,
                        headerStyle: (colum, colIndex) => {
                            return { width: '15%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        formatter: (cellContent, row) => {
                            return <span className="text-info"
                                style={{ fontSize: "20px", fontFamily: "sans-serif" }}>
                                {row.publishDate === null ?
                                    <Button variant="info" style={{ width: '80%', height: '50%' }}
                                        onClick={() => {
                                            if (aliceObj && decode(JSON.parse(aliceObj)['id_token'])) {
                                                var sub = decode(JSON.parse(aliceObj)['id_token'])['sub'];
                                                if (row.creator && sub !== row.creator.sub)
                                                    alert('You are not authorized')
                                                else
                                                    publishPost(row.id)
                                            }
                                            else
                                                alert('You need to login')
                                        }}>publish</Button> :
                                    new Date(row.publishDate).toLocaleDateString()}
                            </span>
                        },
                        sort: false
                    },
                    {
                        dataField: 'operation',
                        text: 'Operation',
                        headerStyle: (colum, colIndex) => {
                            return { width: '10%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        hidden: !aliceObj || !window.matchMedia("screen and (min-width: 992px)").matches,
                        formatter: (cellContent, row) => {
                            return row.published ?
                                <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => copynedit(row)}>Copy</Button>
                                : <Button variant="info" style={{ width: '80%', height: '50%' }}
                                    onClick={() => {
                                        if (aliceObj && decode(JSON.parse(aliceObj)['id_token'])) {
                                            var sub = decode(JSON.parse(aliceObj)['id_token'])['sub'];
                                            if (row.creator && sub !== row.creator.sub)
                                                alert('You are not authorized')
                                            else
                                                edit(row.id)
                                        }
                                        else
                                            alert('You need to login')
                                    }}>Edit</Button>
                        }
                    },
                    {
                        dataField: 'export',
                        text: 'Export to Canvas',
                        hidden: !window.sessionStorage.getItem("canvasToken") || !window.matchMedia("screen and (min-width: 992px)").matches,
                        formatter: (cellContent, row) => {
                            return <div>
                                <Button variant="info" style={{ width: '80%', height: '50%' }}
                                    onClick={function () {
                                        if (row.published) {
                                            exportPage(row.id)
                                        }
                                        else {
                                            alert("You need to publish the rubric before export it");
                                        }
                                    }}>Export</Button>
                            </div>
                        }
                    }
                    ]}
                    defaultSorted={[{
                        dataField: 'publishDate',
                        order: 'desc'
                    }]}
                    pagination={paginationFactory()}
                    hover
                />
            </div>
        );
    }
    else if (category === 'rubric') {
        return (
            <div key="rubrictableDiv" className="mx-auto mt-2">
                <BootstrapTable
                    bootstrap4
                    key="rubrictable"
                    keyField="id"
                    data={posts}
                    columns={[{
                        dataField: 'name',
                        text: 'Name',
                        headerStyle: (colum, colIndex) => {
                            return { width: '60%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        formatter: (cellContent, row) => {
                            return <span className="text-primary"
                                style={{ cursor: "pointer", fontSize: "22px", fontFamily: "sans-serif" }}
                                onClick={() => get(row.id)}>
                                {row.name}</span>
                        },
                        sort: true
                    }, {
                        dataField: 'publishDate',
                        text: 'Publish Date',
                        headerStyle: (colum, colIndex) => {
                            return { width: '15%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        hidden: !window.matchMedia("screen and (min-width: 992px)").matches,
                        formatter: (cellContent, row) => {
                            return <span className="text-info" style={{ textAlign: 'center', fontSize: "20px", fontFamily: "sans-serif" }}>
                                {row.publishDate === null ?
                                    <Button variant="info" style={{ width: '80%', height: '50%' }}
                                        onClick={() => {
                                            if (aliceObj && decode(JSON.parse(aliceObj)['id_token'])) {
                                                var sub = decode(JSON.parse(aliceObj)['id_token'])['sub'];
                                                if (row.creator && sub !== row.creator.sub)
                                                    alert('You are not authorized')
                                                else
                                                    publishPost(row.id)
                                            }
                                            else
                                                alert('You need to login')
                                        }}>publish</Button> :
                                    new Date(row.publishDate).toLocaleDateString()}
                            </span>
                        },
                        sort: true
                    },
                    {
                        dataField: 'lastUpdatedDate',
                        text: 'Last Update Date',
                        headerStyle: (colum, colIndex) => {
                            return { width: '15%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        hidden: !window.matchMedia("screen and (min-width: 992px)").matches,
                        formatter: (cellContent, row) => {
                            return <span className="text-info" style={{ textAlign: 'center', fontSize: "20px", fontFamily: "sans-serif" }}>{new Date(row.lastUpdatedDate).toLocaleDateString()}</span>
                        },
                        sort: true
                    },
                    {
                        dataField: 'export',
                        text: 'Export to Canvas',
                        headerStyle: (colum, colIndex) => {
                            return { width: '10%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        hidden: !window.sessionStorage.getItem("canvasToken") || !window.matchMedia("screen and (min-width: 992px)").matches,
                        formatter: (cellContent, row) => {
                            return <div>
                                <Button variant="info" style={{ width: '80%', height: '50%' }}
                                    onClick={function () {
                                        if (row.published) {
                                            exportPage(row.id)
                                        }
                                        else {
                                            alert("You need to publish the rubric before export it");
                                        }
                                    }}
                                >Export</Button>
                            </div>
                        }
                    }

                    ]}
                    defaultSorted={[{
                        dataField: 'lastUpdatedDate',
                        order: 'desc'
                    }]}
                    pagination={paginationFactory()}
                    hover
                />
            </div>
        );
    }
    else if (category === 'assessmentGroup') {
        return (
            <div key="rubrictableDiv" className="mx-auto mt-2">
                <BootstrapTable
                    bootstrap4
                    key="assessmentGrouptable"
                    keyField="id"
                    data={posts}
                    columns={[{
                        dataField: 'name',
                        text: 'Name',
                        headerStyle: (colum, colIndex) => {
                            return { width: '60%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        formatter: (cellContent, row) => {
                            return <span className="text-primary"
                                style={{ cursor: "pointer", fontSize: "22px", fontFamily: "sans-serif" }}
                                onClick={() => get(row.id)}>
                                {row.rubric.name + " - " + row.name}</span>
                        },
                        sort: true
                    },
                    {
                        dataField: 'assessDate',
                        text: 'Assess Date',
                        headerStyle: (colum, colIndex) => {
                            return { width: '20%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        hidden: !window.matchMedia("screen and (min-width: 992px)").matches,
                        formatter: (cellContent, row) => {
                            return <span className="text-info" style={{ textAlign: 'center', fontSize: "20px", fontFamily: "sans-serif" }}>
                                {row.assessDate === null ?
                                    '' :
                                    new Date(row.assessDate).toLocaleDateString()}
                            </span>
                        },
                        sort: true
                    }
                    ]}
                    defaultSorted={[{
                        dataField: 'assessDate',
                        order: 'desc'
                    }]}
                    pagination={paginationFactory()}
                    hover
                />
            </div>
        );
    }
};

export default Posts;
