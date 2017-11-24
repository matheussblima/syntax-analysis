import React from 'react';
import AceEditor from 'react-ace';
import { getToken, setToken } from './utils/Token';

import './App.css';

class App extends React.Component {
  onChange = (value) => {
    console.log(setToken(value));
    console.log(getToken());
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
