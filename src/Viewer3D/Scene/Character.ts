import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  LoopOnce,
  Scene,
} from "three";

interface CharacterAction extends AnimationAction {
  name: string;
}

class Character {
  private static _instance: Character;
  public model!: Scene;
  public mixer!: AnimationMixer;
  public actions: Map<string, CharacterAction> = new Map<
    string,
    CharacterAction
  >();
  public activeAction: CharacterAction | undefined;
  public previousAction: CharacterAction | undefined;
  public duration = 0.5;

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  public init(model: Scene) {
    Character._instance.model = model;
    // HACK to move char to camera center
    // Character._instance.model.children[0].translateY(-2);
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

    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action = Character._instance.mixer.clipAction(
        clip
      ) as CharacterAction;
      action.name = clip.name;
      Character._instance.actions.set(clip.name, action);
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
      }
    }
  }

  stopAct(key: string, shiftKey: boolean) {
    switch (key) {
      case "KeyW":
        // const walkingAct = characterInstance.actions.get("Running");
        const runningAct = characterInstance.actions.get("Running");
        if (characterInstance.activeAction && runningAct) {
          if (characterInstance.activeAction.name === runningAct!.name) {
            characterInstance.activeAction.stop();
            characterInstance.activeAction = undefined;
          }
        }
        break;
    }
  }

  public sayHello() {
    this.act("KeyH", false);
  }

  act(key: string, shiftKey: boolean) {
    let changeAction = false;

    switch (key) {
      case "KeyD":
        characterInstance.model.rotateY(0.1);
        break;

      case "KeyA":
        characterInstance.model.rotateY(-0.1);
        break;
      case "KeyS":
        const sittingAct = characterInstance.actions.get("Sitting");
        if (!characterInstance.activeAction) {
          characterInstance.activeAction =
            characterInstance.actions.get("Sitting");
          changeAction = true;
        } else if (
          sittingAct &&
          characterInstance.activeAction.name !== sittingAct.name
        ) {
          characterInstance.activeAction =
            characterInstance.actions.get("Sitting");
          changeAction = true;
        }

        break;

      case "KeyW":
        const runningAct = characterInstance.actions.get("Running");
        if (!characterInstance.activeAction) {
          characterInstance.activeAction =
            characterInstance.actions.get("Running");
          changeAction = true;
        } else if (
          runningAct &&
          characterInstance.activeAction.name !== runningAct.name
        ) {
          characterInstance.activeAction =
            characterInstance.actions.get("Running");
          changeAction = true;
        }

        break;
      case "Space":
        characterInstance.activeAction = characterInstance.actions.get("Jump");
        changeAction = true;
        break;

      case "KeyY":
        characterInstance.activeAction = characterInstance.actions.get("Yes");
        changeAction = true;
        break;

      case "KeyN":
        characterInstance.activeAction = characterInstance.actions.get("No");
        changeAction = true;
        break;

      case "KeyH":
        characterInstance.activeAction = characterInstance.actions.get("Wave");
        changeAction = true;
        break;

      case "KeyK":
        characterInstance.activeAction = characterInstance.actions.get("Death");
        changeAction = true;
        break;

      case "KeyT":
        characterInstance.activeAction =
          characterInstance.actions.get("ThumbsUp");
        changeAction = true;
        break;

      case "KeyP":
        characterInstance.activeAction = characterInstance.actions.get("Punch");
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

      if (characterInstance.activeAction)
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
