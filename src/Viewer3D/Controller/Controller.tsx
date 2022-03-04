import { MouseEvent, ReactElement } from "react";
import { characterInstance } from "../Scene/Character";
import { MobileView } from 'react-device-detect';
import "./Controller.scss"


function Controller(props: { isStarted: boolean, isSceneReady: boolean, onStartClick: any }): ReactElement {

  let act: string | undefined = undefined;
  let timeOut: NodeJS.Timeout | undefined = undefined;

  const continuousAct = function () {
    if (act)
      characterInstance.act(act, false);
  }

  const onControlClick = function (event: any, key: string) {
    characterInstance.act(key, false);
  }

  const onControlStart = function (event: any, key: string) {
    // For rotate only
    if (key === "KeyA" || key === "KeyD") {
      act = key;
      timeOut = setInterval(continuousAct, 100);
    } else {
      characterInstance.act(key, false);
    }
  }

  const onControlEnd = function (event: any, key: string) {
    // For rotate only
    if (key === "KeyA" || key === "KeyD") {
      if (timeOut) {
        clearTimeout(timeOut);
      }
    } else {
      characterInstance.stopAct(key, false);
    }
  }

  return (
    <div>
      <div className="overlay-container">
        {!props.isSceneReady ? (
          <div className="start-container">
            <div id="loading">
              <h1 className="loader">
                <span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span>
              </h1>
            </div>
          </div>)
          : (
            <div className="start-container" style={{ width: "100%", height: "100%" }}>{
              !props.isStarted ? (
                <div className="start-container">
                  <button className="start-button" onClick={props.onStartClick}>
                    <svg width="100" height="100" viewBox="0 0 384 512">
                      <path fill="white" d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
                    </svg>
                  </button>
                </div>) :
                <MobileView>
                  <div>
                    <div className="control-button-container-right">
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, "Space")}>J</button><br />
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, "KeyY")} style={{ marginRight: "40px" }} >Y</button>
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, "KeyN")}>N</button> <br />
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, "KeyP")}>P</button>
                    </div>
                    <div className="control-button-container-left">
                      <button className=" control-button" onTouchStart={(event) => onControlStart(event, "KeyW")} onTouchEnd={(event) => onControlEnd(event, "KeyW")}>
                        <svg viewBox="0 0 448 512" className="svg-container">
                          <path fill="#ffffff" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" />
                        </svg>
                      </button>
                      <br />
                      <button className="control-button" style={{ marginRight: "40px" }} onTouchStart={(event) => onControlStart(event, "KeyA")} onTouchEnd={(event) => onControlEnd(event, "KeyA")} >
                        <svg viewBox="0 0 512 512" className="svg-container">
                          <path fill="#ffffff" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z" />
                        </svg>
                      </button>
                      <button className="control-button">
                        <svg viewBox="0 0 512 512" className="svg-container" onTouchStart={(event) => onControlStart(event, "KeyD")} onTouchEnd={(event) => onControlEnd(event, "KeyD")} >
                          <path fill="#ffffff" d="M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z" />
                        </svg>
                      </button>
                      <br />
                    </div>
                  </div>
                </MobileView>
            }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Controller;
