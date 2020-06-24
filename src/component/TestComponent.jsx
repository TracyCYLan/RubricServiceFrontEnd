import { Component } from 'react'
import ApiService from "../service/ApiService";

class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code:this.props.code
        }
    }
    
    componentDidMount() {
        ApiService.getCanvasToken(this.state.code).then(res=>{
            window.sessionStorage.setItem("canvasToken",res.data)
            window.location.replace('/')
        })
    }
    
    render() {
        return ""; 
    }

}

export default TestComponent;