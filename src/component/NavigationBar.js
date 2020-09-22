import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const aliceLink = "oidc.user:https://identity.cysun.org:alice-rubric-service";
const NavigationBar = (props) => (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand as={Link} to='/'>Rubric Service</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <NavDropdown title="Criteria" id="collasible-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/criteria">See All Criteria</NavDropdown.Item>
                    {window.sessionStorage.getItem(aliceLink)?<NavDropdown.Item as={Link} to="/add-criterion">Add a Criterion</NavDropdown.Item>:""}
                    <NavDropdown.Divider />
                </NavDropdown>
                <NavDropdown title="Rubrics" id="collasible-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/rubrics">See All Rubrics</NavDropdown.Item>
                    {window.sessionStorage.getItem(aliceLink)?<NavDropdown.Item as={Link} to="/add-rubric">Add a Rubric</NavDropdown.Item>:""}
                    <NavDropdown.Divider />
                </NavDropdown>
                <NavDropdown title="Tag" id="collasible-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/tags">See All Tags</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown>
                {window.sessionStorage.getItem(aliceLink) ?
                        <NavDropdown title="AssessmentGroups" id="collasible-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/assessmentGroups">See AssessmentGroups</NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>:""}
                {window.sessionStorage.getItem("canvasToken") ?
                    [
                        <NavDropdown title="Import from Canvas" id="collasible-nav-dropdown" key="importCanvas">
                            <NavDropdown.Item as={Link} to="/import-rubric">Import Rubric</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/import-criterion">Import Criterion</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/import-assessments">Import Assessments</NavDropdown.Item>
                            <NavDropdown.Divider /></NavDropdown>] :
                    ""
                }
            </Nav>
            {window.sessionStorage.getItem(aliceLink) ?
                [
                    window.sessionStorage.getItem("canvasToken") ? "" :
                        <Nav key="canvaslogin">
                            <Nav.Link as={Link} to="/redirect">
                                Login to Canvas
                        </Nav.Link>
                        </Nav>,
                    <Nav key="rslogout">
                        <Nav.Link onClick={() => {
                            window.sessionStorage.removeItem(aliceLink);
                            window.sessionStorage.removeItem("canvasToken");
                            window.location.reload(false);
                        }
                        }>Logout</Nav.Link>
                    </Nav>
                ]
                :
                <Nav>
                    <Nav.Link as={Link} to="/auth">Login</Nav.Link>
                </Nav>
            }


        </Navbar.Collapse>
    </Navbar>
)
export default NavigationBar;