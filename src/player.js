import {
  MathUtils, StateMachine, Vehicle,
} from 'yuka';

import {
  DanceState, DeadState, IdleState, RunState, WalkState, PLAYER_STATES,
} from './states';

class Player extends Vehicle {
  constructor(mixer, animations, onHit) {
    super();
    this.onHit = onHit;
    this.mixer = mixer;
    this.animations = animations;

    this.stateMachine = new StateMachine(this);
    this.stateMachine.add(PLAYER_STATES.IDLE, new IdleState());
    this.stateMachine.add(PLAYER_STATES.WALK, new WalkState());
    this.stateMachine.add(PLAYER_STATES.RUN, new RunState());
    this.stateMachine.add(PLAYER_STATES.DANCE, new DanceState());
    this.stateMachine.add(PLAYER_STATES.DEAD, new DeadState());

    this.stateMachine.changeTo(PLAYER_STATES.IDLE);

    this.boundingRadius = 0.6;
    this.npc = false;
    this.maxSpeed = 2;
    this.updateOrientation = true;
  }

  update(delta) {
    this.restrictMovement();
    super.update(delta);

    this.stateMachine.update();
    this.mixer.update(delta);

    return this;
  }

  restrictMovement() {
    if (this.velocity.squaredLength() === 0) {
      return;
    }

    // // ensure player does not leave the game area
    const fieldXHalfSize = 30 / 2;
    const fieldZHalfSize = 100 / 2;

    this.position.x = MathUtils.clamp(
      this.position.x,
      -(fieldXHalfSize - this.boundingRadius),
      fieldXHalfSize - this.boundingRadius,
    );
    this.position.z = MathUtils.clamp(
      this.position.z,
      -(fieldZHalfSize - this.boundingRadius),
      fieldZHalfSize - this.boundingRadius,
    );
  }

  handleMessage({ message }) {
    if (message === 'hit') {
      this.stateMachine.changeTo(PLAYER_STATES.DEAD);
      this.onHit();
    }
    return true;
  }
}

export { Player };
