import React, {Component} from 'react';
import cookie from 'react-cookie';
import * as firebase from 'firebase';
import Main from './Main';
import './App.css';
import GuidePopup from './ModalDialog';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App-Content">
        <GuidePopup />
        <Main />
      </div>
    )
  }
}

export default App;
