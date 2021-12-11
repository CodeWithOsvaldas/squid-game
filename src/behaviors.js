import { SeekBehavior, Vector3, WanderBehavior } from 'yuka';
import { PLAYER_STATES, DOLL_STATES } from './states';
import { getRandomInt } from './utils';

class DumbSeekBehavior extends SeekBehavior {
  constructor(target, owner) {
    super(target);
    this.owner = owner;
  }

  activate() {
    this.owner.stateMachine.changeTo(PLAYER_STATES.RUN);
    this.active = true;
  }
}

class SuicideBehavior extends WanderBehavior {
  constructor(owner) {
    super();
    this.owner = owner;
  }

  activate() {
    this.owner.stateMachine.changeTo(PLAYER_STATES.RUN);
    this.active = true;
  }
}

class SmartSeekBehavior extends SeekBehavior {
  constructor(target, owner) {
    super(target);
    this.owner = owner;
  }

  activate() {
    this.owner.stateMachine.changeTo(PLAYER_STATES.RUN);
    this.active = true;
  }

  calculate(vehicle, force) {
    const doll = this.owner.manager.getEntityByName('doll');
    const currentDollStateId = doll.stateMachine.currentState.id;
    const currentOwnerStateId = vehicle.stateMachine.currentState.id;

    if (
      currentDollStateId === DOLL_STATES.GREEN_LIGHT
            && doll.timer % 5 !== 1
    ) {
      if (currentOwnerStateId !== PLAYER_STATES.RUN) {
        vehicle.stateMachine.changeTo(PLAYER_STATES.RUN);
      }
      return super.calculate(vehicle, force);
    }

    if (currentOwnerStateId !== PLAYER_STATES.IDLE) {
      vehicle.stateMachine.changeTo(PLAYER_STATES.IDLE);
      vehicle.velocity = new Vector3();
    }
    return new Vector3(0, 0, 0);
  }
}

const NPC_BEHAVIORS = [
  (npcPlayer) => new DumbSeekBehavior(
    new Vector3(npcPlayer.position.x, npcPlayer.position.y, -45),
    npcPlayer,
  ),
  (npcPlayer) => new SmartSeekBehavior(
    new Vector3(npcPlayer.position.x, npcPlayer.position.y, -45),
    npcPlayer,
  ),
  (npcPlayer) => new SuicideBehavior(npcPlayer),
];

const MAX_SUICIDERS = 5;
let currentSuiciders = 0;

const getRandomIntEnsuringSuicidersCount = () => getRandomInt(0, currentSuiciders !== MAX_SUICIDERS ? 2 : 1);

const getRandomBehavior = (npcPlayer) => {
  const randomBehavior = NPC_BEHAVIORS[getRandomIntEnsuringSuicidersCount()](npcPlayer);
  if (randomBehavior instanceof SuicideBehavior) {
    currentSuiciders += 1;
  }
  return randomBehavior;
};

export { getRandomBehavior };
