/* eslint-disable no-case-declarations */
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  LoopOnce,
  Scene,
  Vector3
} from 'three';

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

  public static get Instance():Character {
    // Do you need arguments? Make it a regular static method instead.
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }

  public init(model: Scene): void {
    Character._instance.model = model;
    Character._instance.model.scale.set(0.5, 0.5, 0.5);
    // HACK to move char to camera center
    // Character._instance.model.children[0].translateY(-2);
  }

  public loadAnimation(animations: Array<AnimationClip>): void {
    const { model } = Character._instance;
    const states = [
      'Idle',
      'Walking',
      'Running',
      'Dance',
      'Death',
      'Sitting',
      'Standing'
    ];
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

    Character._instance.mixer = new AnimationMixer(model);

    for (let i = 0; i < animations.length; i += 1) {
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

  stopAct(key: string): void {
    switch (key) {
      case 'KeyW':
        // const walkingAct = characterInstance.actions.get("Running");
        const runningAct = Character.Instance.actions.get('Running');
        if (Character.Instance.activeAction && runningAct) {
          if (Character.Instance.activeAction.name === runningAct!.name) {
            Character.Instance.activeAction.stop();
            Character.Instance.activeAction = undefined;
          }
        }
        break;

      case 'KeyS':
        const walkingAct = Character.Instance.actions.get('Walking');
        if (Character.Instance.activeAction && walkingAct) {
          if (Character.Instance.activeAction.name === walkingAct!.name) {
            Character.Instance.activeAction.stop();
            Character.Instance.activeAction = undefined;
          }
        }
        break;
      default:
    }
  }

  public sayHello():void {
    this.act('KeyH');
  }

  public setCharLookAtDirection(x: number, y: number):void {
    const angleRadians = Math.atan2(y - 0, x - 0);
    Character.Instance.model.setRotationFromAxisAngle(
      new Vector3(0, 1, 0),
      Math.PI / 2 + angleRadians
    );
  }

  act(key: string):void {
    let changeAction = false;

    switch (key) {
      case 'KeyW':
        // this.setCharLookAtDirection(0, 90);
        const runningAct = Character.Instance.actions.get('Running');
        if (!Character.Instance.activeAction) {
          Character.Instance.activeAction = Character.Instance.actions.get('Running');
          changeAction = true;
        } else if (
          runningAct && Character.Instance.activeAction.name !== runningAct.name
        ) {
          Character.Instance.activeAction = Character.Instance.actions.get('Running');
          changeAction = true;
        }

        break;
      case 'Space':
        Character.Instance.activeAction = Character.Instance.actions.get('Jump');
        changeAction = true;
        break;

      case 'KeyY':
        Character.Instance.activeAction = Character.Instance.actions.get('Yes');
        changeAction = true;
        break;

      case 'KeyN':
        Character.Instance.activeAction = Character.Instance.actions.get('No');
        changeAction = true;
        break;

      case 'KeyH':
        Character.Instance.activeAction = Character.Instance.actions.get('Wave');
        changeAction = true;
        break;

      case 'KeyK':
        Character.Instance.activeAction = Character.Instance.actions.get('Death');
        changeAction = true;
        break;

      case 'KeyT':
        Character.Instance.activeAction = Character.Instance.actions.get('ThumbsUp');
        changeAction = true;
        break;

      case 'KeyP':
        Character.Instance.activeAction = Character.Instance.actions.get('Punch');
        changeAction = true;
        break;
      default:
    }

    if (changeAction) {
      if (
        Character.Instance.previousAction && Character.Instance.previousAction !== Character.Instance.activeAction
      ) {
        Character.Instance.previousAction.fadeOut(Character.Instance.duration);
      }

      if (Character.Instance.activeAction) {
        Character.Instance.activeAction
          .reset()
          .setEffectiveTimeScale(1)
          .setEffectiveWeight(1)
          .fadeIn(0.2)
          .play();
      }

      Character.Instance.previousAction = Character.Instance.activeAction;
    }
  }
}

export const characterInstance = Character.Instance;
