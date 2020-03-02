import React from 'react';
import { Table,Button } from 'react-bootstrap';
const Posts = ({ posts, loading, get,edit,copynedit }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <Table className="mx-auto mt-2"  responsive="lg" hover="true" bordered="true">
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
                                        <td style={{ width: '80%' }}><span class="text-primary" style={{ cursor: "pointer", fontSize: "20px", fontFamily: "sans-serif" }} onClick={() => get(post.id)}>{post.name}</span></td>
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
};

export default Posts;
