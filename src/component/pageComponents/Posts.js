import React from 'react';
import { Table, Button, Badge, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
const Posts = ({ posts, loading, get, edit, copynedit, getTag, category, publishPost,test }) => {
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
                                        return ([' ', <Button key={tag.id}className="mt-1" variant="secondary" size="sm" onClick={() => getTag(tag.id)}>{tag.value}</Button>])
                                    }
                                )}
                            </Col>]
                        },
                        sort: false
                    }, {
                        dataField: 'publishDate',
                        text: 'Publish Date',
                        headerStyle: (colum, colIndex) => {
                            return { width: '15%', textAlign: 'center', verticalAlign: 'middle' };
                        },
                        // hidden: window.matchMedia("(max-width: 768px)"),
                        formatter: (cellContent, row) => {
                            return <span className="text-info"
                                style={{ fontSize: "20px", fontFamily: "sans-serif" }}>
                                {row.publishDate === null ? 
                                <Button variant="info" style={{ width: '80%', height: '50%' }}
                                onClick={() => publishPost(row.id)}>publish</Button> :
                                new Date(row.publishDate).toLocaleDateString()}
                            </span>
                        },
                        sort: false
                    },
                    {
                        dataField:'',
                        text: 'Operation',
                        formatter: (cellContent, row) => {
                            return row.published ?
                                <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => copynedit(row)}>Copy</Button>
                                : <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => edit(row.id)}>Edit</Button>
                        }
                    },
                    {
                        dataField:'',
                        text: 'Export to Canvas',
                        formatter: (cellContent, row) => {
                            return <div>
                                <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => alert("export")}>Export</Button>
                                </div>
                        },
                        hidden: !window.sessionStorage.getItem("userToken")
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
                        formatter: (cellContent, row) => {
                            return <span className="text-info" style={{ textAlign: 'center', fontSize: "20px", fontFamily: "sans-serif" }}>
                                {row.publishDate === null  ?
                                    <Button variant="info" style={{ width: '80%', height: '50%' }}
                                        onClick={() => publishPost(row.id)}>publish</Button> :
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
                        formatter: (cellContent, row) => {
                            return <span className="text-info" style={{ textAlign: 'center', fontSize: "20px", fontFamily: "sans-serif" }}>{new Date(row.lastUpdatedDate).toLocaleDateString()}</span>
                        },
                        sort: true
                    },
                    {
                        dataField:'',
                        text: 'Export to Canvas',
                        formatter: (cellContent, row) => {
                            return <div>
                                <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => alert("export")}>Export</Button>
                                </div>
                        },
                        hidden: !window.sessionStorage.getItem("userToken")
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
    else if (category === 'tempcriterion') {//temp no one using this
        return (
            <Table className="mx-auto mt-2" responsive="lg" hover="true" bordered="true">
                <thead>
                    <tr>
                        <th style={{ width: '80%' }}>Name</th>
                        <th style={{ width: '10%' }}>Publish Date</th>
                        <th style={{ width: '10%' }}>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.map(
                            post =>
                                <tr key={post.id}>
                                    <td style={{ width: '80%' }}>
                                        <span className="text-primary"
                                            style={{ cursor: "pointer", fontSize: "20px", fontFamily: "sans-serif" }}
                                            onClick={() => get(post.id)}>
                                            {post.name}
                                            {post.tags.map(
                                                function (tag) {
                                                    return ([' ', <Badge variant="info">{tag.value}</Badge>])
                                                }
                                            )}
                                        </span>
                                    </td>
                                    <td style={{ width: '10%' }}><span>{post.publishDate === null ? '--/--/----' : new Date(post.publishDate).toLocaleDateString()}</span></td>
                                    <td style={{ width: '10%' }}>
                                        {post.published ?
                                            <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => copynedit(post)}>Copy</Button>
                                            : <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => edit(post.id)}>Edit</Button>
                                        }
                                    </td>
                                </tr>
                        )
                    }
                </tbody>
            </Table>
        );
    }
};

export default Posts;
