import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const NavigationBar = (props) => (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Rubric Service</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <NavDropdown title="Criteria" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/criteria">See All Criteria</NavDropdown.Item>
                    {/* so far add-criterion cannot work cuz I am not able to check if this.props.location.state.name is null in AddCriterionComponent constructor */}
                    {/* <NavDropdown.Item href="/add-criterion">Add a Criterion</NavDropdown.Item> */}
                    <NavDropdown.Divider />
                </NavDropdown>
                <NavDropdown title="Rubrics" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/rubrics">See All Rubrics</NavDropdown.Item>
                    <NavDropdown.Item href="/add-rubric">Add a Rubric</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown>
            </Nav>
            <Nav>
                <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
)
export default NavigationBar;