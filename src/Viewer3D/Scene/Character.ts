import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  LoopOnce,
  Scene,
  Vector3,
} from "three";

class Character {
  private static _instance: Character;
  public model!: Scene;
  public mixer!: AnimationMixer;
  public actions!: Object;
  public activeAction!: AnimationAction;
  public previousAction!: AnimationAction;
  public duration = 0.5;

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  public init(model: Scene) {
    Character._instance.model = model;
  }

  public loadAnimation(animations: Array<AnimationClip>) {
    const model = Character._instance.model;
    const states = [
      "Idle",
      "Walking",
      "Running",
      "Dance",
      "Death",
      "Sitting",
      "Standing",
    ];
    const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];

    Character._instance.mixer = new AnimationMixer(model);

    Character._instance.actions = {};

    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action = Character._instance.mixer.clipAction(clip);
      //@ts-ignore
      action.name = clip.name;
      //@ts-ignore
      Character._instance.actions[clip.name] = action;

      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
      }
    }
    // Character._instance.act();
  }

  stopAct(key: string) {
    switch (key) {
      case "KeyW":
        if (characterInstance.activeAction) {
          if (
            characterInstance.activeAction ===
            //@ts-ignore
            characterInstance.actions["Running"]
          ) {
            characterInstance.activeAction.stop();
            //@ts-ignore
            characterInstance.activeAction = undefined;
          }
        }
        break;
    }
  }

  act(key: string) {
    let changeAction = false;

    switch (key) {
      case "KeyD":
        characterInstance.model.rotateY(0.2);
        break;

      case "KeyA":
        characterInstance.model.rotateY(-0.2);
        break;

      case "KeyW":
        if (
          characterInstance.activeAction !=
          //@ts-ignore
          characterInstance.actions["Running"]
        ) {
          characterInstance.activeAction =
            //@ts-ignore
            characterInstance.actions["Running"];
          changeAction = true;
        }

        break;
      case "Space":
        //@ts-ignore
        characterInstance.activeAction = characterInstance.actions["Jump"];
        changeAction = true;
        break;

      case "KeyY":
        //@ts-ignore
        characterInstance.activeAction = characterInstance.actions["Yes"];
        changeAction = true;
        break;

      case "KeyN":
        //@ts-ignore
        characterInstance.activeAction = characterInstance.actions["No"];
        changeAction = true;
        break;

      case "KeyH":
        //@ts-ignore
        characterInstance.activeAction = characterInstance.actions["Wave"];
        changeAction = true;
        break;

      case "KeyT":
        //@ts-ignore
        characterInstance.activeAction = characterInstance.actions["ThumbsUp"];
        changeAction = true;
        break;

      case "KeyP":
        //@ts-ignore
        characterInstance.activeAction = characterInstance.actions["Punch"];
        changeAction = true;
        break;
    }

    if (changeAction) {
      if (
        characterInstance.previousAction &&
        characterInstance.previousAction !== characterInstance.activeAction
      ) {
        characterInstance.previousAction.fadeOut(characterInstance.duration);
      }

      characterInstance.activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.2)
        .play();

      characterInstance.previousAction = characterInstance.activeAction;
    }
  }
}

export const characterInstance = Character.Instance;
