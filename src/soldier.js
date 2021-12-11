import { GameEntity, StateMachine, Vector3 } from 'yuka';

import { IdleState, PLAYER_STATES } from './states';

class Soldier extends GameEntity {
  constructor(mixer, animations) {
    super();
    this.npc = true;
    this.mixer = mixer;
    this.animations = animations;
    this.stateMachine = new StateMachine(this);
    this.stateMachine.add(PLAYER_STATES.IDLE, new IdleState());
    this.stateMachine.changeTo(PLAYER_STATES.IDLE);
    this.scale = new Vector3(0.2, 0.2, 0.2);
    this.canActivateTrigger = false;
  }

  update(delta) {
    super.update(delta);
    this.stateMachine.update();
    this.mixer.update(delta);
    return this;
  }
}

export { Soldier };
