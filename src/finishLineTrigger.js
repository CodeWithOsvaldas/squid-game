import { Trigger } from 'yuka';
import { PLAYER_STATES } from './states';

class FinishLineTrigger extends Trigger {
  constructor(triggerRegion) {
    super(triggerRegion);
    this.cache = {};
  }

  check(player) {
    if (this.region.touching(player) === true && !this.cache[player.uuid]) {
      this.execute(player);
    }
    return this;
  }

  execute(player) {
    super.execute();

    if (player.stateMachine.currentState.id !== PLAYER_STATES.DANCE) {
      player.stateMachine.changeTo(PLAYER_STATES.DANCE);
      if (player.npc) {
        player.steering.clear();
      }
      this.cache[player.uuid] = true;
    }
  }
}

export { FinishLineTrigger };
