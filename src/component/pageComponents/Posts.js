import React from 'react';
import { Table, Button, Badge, Accordion, Card } from 'react-bootstrap';
const Posts = ({ posts, loading, get, edit, copynedit, category, chooseC }) => {
    if (loading) {
        return <h2>Loading...</h2>;
    }
    if (category === 'criterion') {
        return (
            <Table className="mx-auto mt-2" responsive="lg" hover="true" bordered="true">
                <thead>
                    <tr>
                        <th style={{ width: '80%' }}>Name</th>
                        <th style={{ width: '10%' }}>Publish</th>
                        <th style={{ width: '10%' }}>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.map(
                            post =>
                                <tr key={post.id}>
                                    <td style={{ width: '80%' }}>
                                        <span class="text-primary"
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
                                    <td style={{ width: '10%' }}><span>{post.published ? "Yes" : "No"}</span></td>
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
    else if (category === 'rubric') {
        return (
            <Table className="mx-auto mt-2" responsive="lg" hover="true" bordered="true">
                <thead>
                    <tr>
                        <th style={{ width: '65%' }}>Name</th>
                        <th style={{ width: '15%', textAlign: 'center' }}>Last Updated</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Publish</th>
                        {/* <th style={{ width: '10%', textAlign: 'center' }}>Operation</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.map(
                            post =>
                                <tr key={post.id}>
                                    <td style={{ width: '65%' }}>
                                        <span class="text-primary"
                                            style={{ cursor: "pointer", fontSize: "20px", fontFamily: "sans-serif" }}
                                            onClick={() => get(post.id)}>
                                            {post.name}
                                        </span>
                                    </td>
                                    <td style={{ width: '15%', textAlign: 'center' }}>{new Date(post.lastUpdatedDate).toLocaleDateString()}</td>
                                    <td class="text-success font-weight-bold" style={{ width: '10%', textAlign: 'center' }}><span>{post.published ? "Yes" : "No"}</span></td>
                                    {/* <td style={{ width: '10%', textAlign: 'center' }}>
                                        {post.published ?
                                            <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => copynedit(post)}>Copy</Button>
                                            : <Button variant="info" style={{ width: '80%', height: '50%' }} onClick={() => edit(post.id)}>Edit</Button>
                                        }
                                    </td> */}
                                </tr>
                        )
                    }
                </tbody>
            </Table>
        );
    }
    else if (category === 'importcriterion') {
        return (
            <Table className="mx-auto mt-2" responsive="lg" bordered="true">
                <thead>
                    <tr>
                        <th style={{ width: '80%' }}>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <Accordion>
                        {
                            posts.map(
                                post =>
                                    [<Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={post.id}>
                                                {post.name}
                                                {post.tags.map(
                                                    function (tag) {
                                                        return ([' ', <Badge variant="info">{tag.value}</Badge>])
                                                    }
                                                )}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={post.id}>
                                            <Card.Body>{post.description}</Card.Body>
                                        </Accordion.Collapse>
                                    </Card>,
                                    <Button className="float-none" variant="outline-secondary" onClick={chooseC(post.id)}>import</Button>]
                            )
                        }
                    </Accordion>

                </tbody>
            </Table>
        );
    }
};

export default Posts;
