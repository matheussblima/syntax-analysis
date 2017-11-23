import React from 'react';
import AceEditor from 'react-ace';
import { isIdentifier } from './utils/Validations';

import './App.css';

class App extends React.Component {
  onChange = (value) => {
    console.log(isIdentifier(value));
  };

  render() {
    return (
      <div className="App">
        <AceEditor
          mode="java"
          theme="github"
          onChange={this.onChange}
          name="Java Synatax Analysis"
          editorProps={{ $blockScrolling: true }}
        />,
      </div>
    );
  }
}

export default App;
