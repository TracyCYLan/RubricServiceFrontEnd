import React from 'react';
import { Container } from 'react-bootstrap';

const Layout = (props) => (
  <Container key="1">
    {props.children}
  </Container>
)
export default Layout;