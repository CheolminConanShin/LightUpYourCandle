import React, {Component} from 'react';
import cookie from 'react-cookie';
import * as firebase from 'firebase';
import './Main.css';

const firebaseConfig = {
  // apiKey: "AIzaSyD1dwdlLGu9rtPE6T7tqqURaK-GCRie7wo",
  // authDomain: "ultralisk-c45b9.firebaseapp.com",
  databaseURL: "https://lightupyourcandle-6270c.firebaseio.com/",
  // storageBucket: "ultralisk-c45b9.appspot.com",
  // messagingSenderId: "327293237250"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseReference = firebaseApp.database().ref();

/** Reference : http://blog.naver.com/yellowcar7910/220869574933
고려 사이버 대학교 : 37.586647, 126.985551
경기 대학교 대학원 : 37.564360, 126.962012
**/
const topRightCorner_latitude = 37.586647;
const topRightCorner_longitude = 126.985551;
const leftBottom_latitude = 37.5643604;
const leftBottom_longitude = 126.962012;

// const topRightCorner_latitude = 37.469047;
// const topRightCorner_longitude = 127.024321;
// const leftBottom_latitude = 37.462720;
// const leftBottom_longitude = 127.022840;

class Main extends Component {
  constructor(props) {
    super(props);

    const attendance = cookie.load('attendance');
    let geolocationAvailable = false;

    if("geolocation" in navigator) {
      geolocationAvailable = true;
    }
    this.state = {
      buttonText: attendance === undefined ? buttonStates.lightYourCandle: buttonStates.alreadyLighted,
      buttonStyle: attendance === undefined ? styles.activeButton : styles.inActiveButton,
      attendanceCount: 0,
      geolocationAvailable: geolocationAvailable,
      latitude: "N/A",
      longitude: "N/A"
    };

    this.onAttendClick = this.onAttendClick.bind(this);
    this.onHackClick = this.onHackClick.bind(this);

    firebaseReference.once("value", (snapshot)=> {
      let count = snapshot.numChildren();

      this.setState(Object.assign({}, this.state, {
        attendanceCount: count
      }));
    });
  }

  componentDidMount() {
    if(this.state.buttonText == buttonStates.alreadyLighted) return;
    if(this.state.geolocationAvailable) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState(Object.assign({}, this.state, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));

        if(this.state.latitude <= topRightCorner_latitude && this.state.latitude >= leftBottom_latitude &&
          this.state.longitude <= topRightCorner_longitude && this.state.longitude >= leftBottom_longitude){
            this.setState(Object.assign({}, this.state, {
              buttonText: this.state.buttonText,
            }));
          } else {
            this.setState(Object.assign({}, this.state, {
              buttonText: buttonStates.pleaseAttend,
              buttonStyle: styles.inActiveButton
            }));
          }
        });
      }
    }

    render() {
      return (
        <div className="Main">
        <p>현재까지 켜진 촛불 수</p>
        <p className="attendanceCountField">
        <svg className="Lighted-candle">
        <image xlinkHref="/images/candle.svg"/>
        </svg>
        <span>{this.state.attendanceCount}명</span>
        </p>
        <div className="candleButton" onClick={this.onAttendClick} style={this.state.buttonStyle}>
        <span>{this.state.buttonText}</span>
        </div>
        <p><a className="shareLink" href="#">주변 지인에게 공유하기</a></p>
        <div className="warningTitle">
        <p>정확한 집회인원 추산을 위해</p>
        </div>
        <div className="warningContents">
        <p>- 현재위치가 광화문 중심 반경 3Km이내에서 촛불켜기 가능</p>
        <p>- 집회 시간(11/26 오후 4시부터 10시까지)에만 촛불켜기 가능</p>
        <p>- 1인 1회만 촛불켜기가 가능합니다 변칙적인 방법은 노노노</p>
        </div>
        </div>
      );
    }

    onHackClick() {
      let newKey = firebaseReference.push().key;
      let updates = {};
      updates[newKey] = 1;

      firebaseReference.update(updates);
      firebaseReference.once("value", (snapshot) => {
        this.setState(Object.assign({}, this.state, {
          attendanceCount: snapshot.numChildren()
        }));
      });
    }

    onAttendClick() {
      let newKey = firebaseReference.push().key;
      cookie.save("attendance", newKey);

      let updates = {};
      updates[newKey] = 1;

      firebaseReference.update(updates);

      firebaseReference.child(newKey).once("value", (snapshot)=>{
        if(snapshot.val() == 1) {
          this.setState(Object.assign({}, this.state, {
            buttonText: buttonStates.alreadyLighted,
            attendanceCount: this.state.attendanceCount + 1,
            buttonStyle: styles.inActiveButton
          }));
        }
        else {
          cookie.remove("attendance");
          alert("죄송합니다. 다시 시도해주세요.");
          this.setState(Object.assign({}, this.state, {
            buttonText: buttonStates.lightYourCandle,
            buttonStyle: styles.activeButton
          }));
        }
      });
    }
  }

  const styles = {
    activeButton: {
      pointerEvents: "all"
    },
    inActiveButton: {
      pointerEvents: "none",
      color: "#979797"
    }
  };

  const buttonStates = {
    lightYourCandle: "촛불 켜기",
    alreadyLighted: "촛불을 밝히셨습니다",
    pleaseAttend: "집회장이 아닙니다"
  }

  export default Main;
