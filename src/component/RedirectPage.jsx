import React, { Component } from 'react'
//redirect page to call Canvas API
class RedirectPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
        }

    }

    componentDidMount() {
        // window.location.replace("http://localhost:8080/canvas/oauth_callback?code=324fdjv30tefdvcfew42refd23rfscx")
        // window.location.replace("https://alice.cysun.org/alice-rubrics/canvas/oauth_callback?code=324fdjv30tefdvcfew42refd23rfscx")
        window.location.replace("https://calstatela.instructure.com:443/login/oauth2/auth?client_id=115900000000000014&response_type=code&scope=url:GET|/api/v1/courses/:course_id/rubrics url:GET|/api/v1/courses url:GET|/api/v1/courses/:course_id/rubrics/:id url:GET|/api/v1/courses/:course_id/outcome_group_links url:GET|/api/v1/outcomes/:id 	url:GET|/api/v1/courses/:course_id/outcome_groups url:POST|/api/v1/courses/:course_id/outcome_groups/:id/outcomes &redirect_uri=https://alice.cysun.org/alice-rubrics/canvas/oauth_callback");
    }

    

    render() {
        return <div></div>;
    }

}

export default RedirectPage;