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
        window.location.replace("http://localhost:8080/canvas/hello?name="+window.sessionStorage.getItem("userToken"))
        // window.location.replace("https://calstatela.instructure.com:443/login/oauth2/auth?client_id=115900000000000014&response_type=code&state=YYY&redirect_uri=http://ecst-csproj2.calstatela.edu:6350/alice-rubrics/canvas/oauth_callback&scope=url:GET|/api/v1/courses/:course_id/rubrics")
    }

    

    render() {
        return <div></div>;
    }

}

export default RedirectPage;