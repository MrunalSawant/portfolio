/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { MouseEvent, ReactElement } from 'react';
import { MobileView } from 'react-device-detect';
// eslint-disable-next-line import/no-unresolved
import { Joystick } from 'react-joystick-component';
import { characterInstance } from '../Scene/Character';
import './Controller.scss';

function Controller(props: { isStarted: boolean, isSceneReady: boolean, onStartClick: any }): ReactElement {
  const onControlClick = (event: any, key: string): void => {
    characterInstance.act(key);
  };

  const onControlStart = (event: any): void => {
    characterInstance.setCharLookAtDirection(event.x, event.y);
    characterInstance.act('KeyW');
  };

  const onControlEnd = (): void => {
    characterInstance.stopAct('KeyW');
  };

  return (
    <div>
      <div className="overlay-container">
        {!props.isSceneReady ? (
          <div className="start-container">
            <div id="loading">
              <h1 className="loader">
                <span>L</span>
                <span>O</span>
                <span>A</span>
                <span>D</span>
                <span>I</span>
                <span>N</span>
                <span>G</span>
              </h1>
            </div>
          </div>
        ) : (
          <div className="start-container" style={{ width: '100%', height: '100%' }}>
            {
              !props.isStarted ? (
                <div className="start-container">
                  <button className="start-button" onClick={props.onStartClick}>
                    <svg width="100" height="100" viewBox="0 0 384 512">
                      <path fill="white" d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <MobileView>
                  <div>
                    <div className="control-button-container-right">
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, 'KeyP')}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 0 24 24" width="25px" fill="gray">
                          <path />
                          <path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z" />
                        </svg>
                      </button>
                      <br />
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, 'KeyY')} style={{ marginRight: '40px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 0 24 24" width="25px" fill="gray">
                          <path />
                          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                        </svg>
                      </button>
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, 'KeyN')}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 0 24 24" width="25px" fill="gray">
                          <path />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                        </svg>
                      </button>
                      {' '}
                      <br />
                      <button className="control-button" onClick={(event: MouseEvent | TouchEvent) => onControlClick(event, 'Space')}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 0 24 24" width="25px" fill="gray">
                          <path />
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                      </button>
                    </div>
                    <div className="control-button-container-left">
                      <Joystick size={100} sticky={false} baseColor="white" stickColor="rgb(177, 177, 177)" move={onControlStart} stop={onControlEnd} />
                    </div>
                  </div>
                </MobileView>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default Controller;
