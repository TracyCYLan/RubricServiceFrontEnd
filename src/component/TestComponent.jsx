import { Component } from 'react'

class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            token: window.sessionStorage.getItem("userToken"),
            hello:this.props.hello
        }
    }
    
    //if contains cookie, then we do callback, if not, we head to /login
    componentDidMount() {
        alert(this.state.hello)
    }
    
    render() {
        return ""; 
    }

}

export default TestComponent;