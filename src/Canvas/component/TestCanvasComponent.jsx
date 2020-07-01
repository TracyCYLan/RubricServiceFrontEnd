import { Component } from 'react'

class TestCanvasComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null
        }
    }

    componentDidMount() {
        window.sessionStorage.setItem("canvasToken",'11590~VWZMtWiJtlWmE8St8vW8UBmQOoLpX0nhjSUMXZhbPC8eXNE5Pk63FuvNLzVRNYbh');
    }
    
    render() {
        return ""; 
    }

}

export default TestCanvasComponent;