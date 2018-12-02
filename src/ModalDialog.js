import React, {Component} from 'react';
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
import './ModalDialog.css';

const customStyles = {
  content : {
    top : '6%',
    left: '6%',
    right: '6%',
    bottom : '6%',
    background : 'white',
    padding : '7px'
  }
};

class GuidePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: true
    }

    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    // this.setState(Object.assign({}, this.state, {
    //   modalIsOpen: true
    // }));
  }

  closeModal() {
      this.setState({
        modalIsOpen: false
      });
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}>
            <div className="popupTitle">
              <p>집회 장소로 이동하여</p>
              <p>촛불을 켜주세요</p>
            </div>
            <img className="mapImage" src="https://github.com/CheolminConanShin/LightUpYourCandle/blob/master/src/images/map.png?raw=true" />
            <div className="cancelButton" >
              <span onClick={this.closeModal}>닫기</span>
            </div>
        </Modal>
      </div>
    );
  }
}

  export default GuidePopup;
