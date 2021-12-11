import { GameEntity, StateMachine } from 'yuka';

import {
  DOLL_STATES,
  DollEliminateAllState,
  DollGreenLightState,
  DollRedLightState,
} from './states';

class Doll extends GameEntity {
  constructor(mixer, animations) {
    super();

    this.mixer = mixer;
    this.animations = animations;
    this.stateMachine = new StateMachine(this);
    this.stateMachine.add(DOLL_STATES.GREEN_LIGHT, new DollGreenLightState());
    this.stateMachine.add(DOLL_STATES.RED_LIGHT, new DollRedLightState());
    this.stateMachine.add(DOLL_STATES.ELIMINATE_ALL, new DollEliminateAllState());

    this.updateOrientation = true;
    this.canActivateTrigger = false;
    this.timer = null;
    this.name = 'doll';
  }

  update(delta) {
    super.update(delta);

    const { currentState } = this.stateMachine;
    if (currentState && this.timer !== null) {
      const currentStateId = currentState.id;
      if (this.timer % 5 === 0 && currentStateId === DOLL_STATES.GREEN_LIGHT) {
        this.timer = null;
        this.stateMachine.changeTo(DOLL_STATES.RED_LIGHT);
      }
      if (this.timer % 5 === 0 && currentStateId === DOLL_STATES.RED_LIGHT) {
        this.timer = null;
        this.stateMachine.changeTo(DOLL_STATES.GREEN_LIGHT);
      }
    }

    this.stateMachine.update();
    this.mixer.update(delta);
    return this;
  }
}

export { Doll };
