import * as THREE from 'three';
import { State, Vector3 } from 'yuka';
import { Player } from './player';
import { soundManager } from './soundManager';

const PLAYER_STATES = {
  IDLE: 'IDLE',
  WALK: 'WALK',
  RUN: 'RUN',
  DANCE: 'DANCE',
  DEAD: 'DEAD',
};

const DOLL_STATES = {
  GREEN_LIGHT: 'GREEN_LIGHT',
  RED_LIGHT: 'RED_LIGHT',
  ELIMINATE_ALL: 'ELIMINATE_ALL',
};

class IdleState extends State {
  constructor(props) {
    super(props);
    this.id = PLAYER_STATES.IDLE;
  }

  enter(player) {
    const idle = player.animations.get(PLAYER_STATES.IDLE);
    const { previousState } = player.stateMachine;
    if (previousState) {
      const previousAnimation = player.animations.get(previousState.id);
      idle.time = 0.0;
      idle.enabled = true;
      idle.setEffectiveTimeScale(1.0);
      idle.setEffectiveWeight(1.0);
      idle.crossFadeFrom(previousAnimation, 0.5, true);
    }
    idle.enabled = true;
  }

  execute(player) {
    const { input, stateMachine, npc } = player;
    if (!npc) {
      if (input.forward || input.backward || input.left || input.right) {
        stateMachine.changeTo(PLAYER_STATES.WALK);
      }
    }
  }

  exit() {}
}

class WalkState extends State {
  constructor(props) {
    super(props);
    this.id = PLAYER_STATES.WALK;
  }

  enter(player) {
    const walk = player.animations.get(PLAYER_STATES.WALK);
    const { previousState } = player.stateMachine;
    const previousAnimation = player.animations.get(previousState.id);

    walk.enabled = true;
    if (previousState.id === PLAYER_STATES.RUN) {
      const ratio = walk.getClip().duration / previousAnimation.getClip().duration;
      walk.time = previousAnimation.time * ratio;
    } else {
      walk.time = 0.0;
      walk.setEffectiveTimeScale(1.0);
      walk.setEffectiveWeight(1.0);
    }
    walk.crossFadeFrom(previousAnimation, 0.5, true);
  }

  execute(player) {
    const { input, stateMachine } = player;
    if (input.forward || input.backward || input.left || input.right) {
      if (input.shift) {
        stateMachine.changeTo(PLAYER_STATES.RUN);
      }
      return;
    }
    stateMachine.changeTo(PLAYER_STATES.IDLE);
  }

  exit() {}
}

class RunState extends State {
  constructor(props) {
    super(props);
    this.id = PLAYER_STATES.RUN;
  }

  enter(player) {
    const run = player.animations.get(PLAYER_STATES.RUN);
    const { previousState } = player.stateMachine;
    const previousAnimation = player.animations.get(previousState.id);

    run.enabled = true;
    if (previousState.id === PLAYER_STATES.WALK) {
      const ratio = run.getClip().duration / previousAnimation.getClip().duration;
      run.time = previousAnimation.time * ratio;
    } else {
      run.time = 0.0;
      run.setEffectiveTimeScale(1.0);
      run.setEffectiveWeight(1.0);
    }
    run.crossFadeFrom(previousAnimation, 0.5, true);
  }

  execute(player) {
    const { npc, input, stateMachine } = player;
    if (!npc) {
      if (input.forward || input.backward || input.left || input.right) {
        if (!input.shift) {
          stateMachine.changeTo(PLAYER_STATES.WALK);
        }
        return;
      }
      stateMachine.changeTo(PLAYER_STATES.IDLE);
    }
  }

  exit() {}
}

class DeadState extends State {
  constructor(props) {
    super(props);
    this.id = PLAYER_STATES.DEAD;
  }

  enter(player) {
    const deadState = player.animations.get(PLAYER_STATES.DEAD);
    const { previousState } = player.stateMachine;
    const previousAnimation = player.animations.get(previousState.id);

    deadState.enabled = true;
    deadState.crossFadeFrom(previousAnimation);
    deadState.setLoop(THREE.LoopOnce);
    deadState.clampWhenFinished = true;
    player.velocity = new Vector3();
  }

  execute() {
  }

  exit() {}
}

class DanceState extends State {
  constructor(props) {
    super(props);
    this.id = PLAYER_STATES.DANCE;
  }

  enter(player) {
    player.velocity = new Vector3();
    player.lookAt(new THREE.Vector3(0, 0, 0));
    const dance = player.animations.get(PLAYER_STATES.DANCE);
    const { previousState } = player.stateMachine;
    const previousAnimation = player.animations.get(previousState.id);

    dance.enabled = true;
    if (
      previousState.id === PLAYER_STATES.WALK
            || previousState.id === PLAYER_STATES.RUN
    ) {
      const ratio = dance.getClip().duration / previousAnimation.getClip().duration;
      dance.time = previousAnimation.time * ratio;
    } else {
      dance.time = 0.0;
      dance.setEffectiveTimeScale(1.0);
      dance.setEffectiveWeight(1.0);
    }
    dance.crossFadeFrom(previousAnimation, 0.5, true);
  }

  execute() {}

  exit() {}
}

class DollGreenLightState extends State {
  constructor(props) {
    super(props);
    this.id = DOLL_STATES.GREEN_LIGHT;
  }

  enter(doll) {
    doll.rotateTo(new Vector3(0, 0, -100), 1);
  }

  execute() {}

  exit() {}
}

class DollRedLightState extends State {
  constructor(props) {
    super(props);
    this.id = DOLL_STATES.RED_LIGHT;
  }

  searchForMovingPlayers(doll) {
    doll.manager.entities
      .filter((entity) => entity instanceof Player)
      .filter((entity) => {
        const { id } = entity.stateMachine.currentState;
        return id === PLAYER_STATES.WALK || id === PLAYER_STATES.RUN;
      })
      .forEach((entity) => {
        soundManager.gunfire.play();
        doll.manager.sendMessage(doll, entity, 'hit', 0);
      });
  }

  enter(doll) {
    doll.rotateTo(new Vector3(0, 0, 0), 1);
    this.searchForMovingPlayers(doll);
  }

  execute(doll) {
    this.searchForMovingPlayers(doll);
  }

  exit() {}
}

class DollEliminateAllState extends State {
  constructor(props) {
    super(props);
    this.id = DOLL_STATES.ELIMINATE_ALL;
  }

  eliminateAll(doll) {
    doll.manager.entities
      .filter((entity) => entity instanceof Player)
      .filter((entity) => {
        const { id } = entity.stateMachine.currentState;
        return id !== PLAYER_STATES.DEAD && id !== PLAYER_STATES.DANCE;
      })
      .forEach((entity) => {
        soundManager.gunfire.play();
        doll.manager.sendMessage(doll, entity, 'hit', 0);
      });
  }

  enter(doll) {
    doll.rotateTo(new Vector3(0, 0, 0), 1);
    this.eliminateAll(doll);
  }

  execute(doll) {
    this.eliminateAll(doll);
  }

  exit() {}
}

export {
  IdleState,
  WalkState,
  RunState,
  DanceState,
  DeadState,
  PLAYER_STATES,
  DollGreenLightState,
  DollRedLightState,
  DollEliminateAllState,
  DOLL_STATES,
};
