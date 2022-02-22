import { characterInstance } from "../Scene/Character";

class Controls {
  private static _instance: Controls;

  public init() {
    console.log("Controls");
    document.onkeydown = function (event: KeyboardEvent) {
      characterInstance.act(event.code, event.shiftKey);
      // event.preventDefault();
    };

    document.onkeyup = function (event: KeyboardEvent) {
      characterInstance.stopAct(event.code, event.shiftKey);
      event.preventDefault();
    };

    document.onmousedown = function (event: MouseEvent) {
      // Punch on mouse click
    };
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
}

export const myClassInstance = Controls.Instance;
