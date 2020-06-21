import React, { Component } from 'react'

class RedirectPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
        }

    }

    componentDidMount() {
        window.location.replace("http://localhost:8080/canvas/hello?name="+window.localStorage.getItem("userToken"))
    }

    

    render() {
        return <div></div>;
    }

}

export default RedirectPage;