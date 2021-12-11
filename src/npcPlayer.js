import { Player } from './player';
import { PLAYER_STATES } from './states';

class NpcPlayer extends Player {
  constructor(mixer, animations) {
    super(mixer, animations);
    this.npc = true;
  }

  addBehavior(behavior) {
    this.behavior = behavior;
    this.steering.add(this.behavior);
  }

  handleMessage({ message }) {
    if (message === 'hit') {
      this.stateMachine.changeTo(PLAYER_STATES.DEAD);
      this.steering.clear();
    }
    return true;
  }
}

export { NpcPlayer };
