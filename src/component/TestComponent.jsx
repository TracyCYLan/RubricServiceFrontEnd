import React, {Component} from 'react';
import RichTextEditor from 'react-rte';
import {Button} from 'react-bootstrap'
class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            richTextValue: RichTextEditor.createEmptyValue()
        }
        this.richTextonChange = this.richTextonChange.bind(this);
    }
    richTextonChange = (richTextValue) => {
        this.setState({richTextValue});
        if (this.props.onChange) {
          // Send the changes up to the parent component as an HTML string.
          // This is here to demonstrate using `.toString()` but in a real app it
          // would be better to avoid generating a string on each change.
          this.props.onChange(
            richTextValue.toString('html')
          );
        }
      };
    
    render() {
            return [
      <RichTextEditor
        value={this.state.richTextValue}
        onChange={this.richTextonChange}
      />,
      <Button onClick={()=>alert(this.state.richTextValue.toString("html"))}>click</Button>
            ];
    }

}

export default TestComponent;