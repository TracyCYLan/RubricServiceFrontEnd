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
                    <NavDropdown.Item href="/add-criterion">Add a Criterion</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown>
                <NavDropdown title="Rubrics" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/rubrics">See All Rubrics</NavDropdown.Item>
                    <NavDropdown.Item href="/add-rubric">Add a Rubric</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown>
                <NavDropdown title="Tag" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/tags">See All Tags</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown>
                <NavDropdown title="AssessmentGroups" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/assessmentGroups">See AssessmentGroups</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown>
                {window.sessionStorage.getItem("canvasToken") ?
                    [
                        <NavDropdown title="Import from Canvas" id="collasible-nav-dropdown" key="importCanvas">
                            <NavDropdown.Item href="/import-rubric">Import Rubric</NavDropdown.Item>
                            <NavDropdown.Item href="/import-criterion">Import Criterion</NavDropdown.Item>
                            <NavDropdown.Item href="/import-assessments">Import Assessments</NavDropdown.Item>
                            <NavDropdown.Divider /></NavDropdown>] :
                    ""
                }
            </Nav>
            {window.sessionStorage.getItem("userToken") ?
                [
                    <Nav key="canvaslogin">
                        <Nav.Link href="/redirect">
                            Login to Canvas
                        </Nav.Link>
                    </Nav>,
                    <Nav key="rslogout">
                        <Nav.Link onClick={() => {
                            window.sessionStorage.removeItem("userToken");
                            window.sessionStorage.removeItem("canvasToken");
                            window.location.reload(false);
                        }
                        }>Logout</Nav.Link>
                    </Nav>
                ]
                :
                <Nav>
                    <Nav.Link href="/login">Login</Nav.Link>
                </Nav>
            }


        </Navbar.Collapse>
    </Navbar>
)
export default NavigationBar;