import { Vector3 } from 'yuka';
import { PLAYER_STATES } from './states';

const direction = new Vector3();

class ThirdPersonControls {
  constructor(owner = null, camera = null) {
    this.owner = owner;
    this.camera = camera;
    this.cameraOffset = new Vector3(0, 200, 10);
    this.cameraMovementSpeed = 2.5;
    this.brakingForce = 10;

    this.input = {
      forward: false,
      backward: false,
      right: false,
      left: false,
      shift: false,
    };
    this.keyDownHandler = onKeyDown.bind(this);
    this.keyUpHandler = onKeyUp.bind(this);
  }

  connect() {
    document.addEventListener('keydown', this.keyDownHandler, false);
    document.addEventListener('keyup', this.keyUpHandler, false);
  }

  update(delta) {
    const { input } = this;
    this.owner.input = input;
    const currentStateId = this.owner.stateMachine.currentState.id;

    if (
      currentStateId !== PLAYER_STATES.DANCE
            && currentStateId !== PLAYER_STATES.DEAD
    ) {
      this.owner.maxSpeed = input.shift ? 4 : 2;
      direction.z = Number(input.backward) - Number(input.forward);
      direction.x = Number(input.right) - Number(input.left);
      direction.normalize();

      if (direction.squaredLength() === 0) {
        // brake
        this.owner.velocity.x
                    -= this.owner.velocity.x * this.brakingForce * delta;
        this.owner.velocity.z
                    -= this.owner.velocity.z * this.brakingForce * delta;
      } else {
        this.owner.velocity.add(direction);
      }

      // update camera
      const offsetX = this.camera.position.x - this.cameraOffset.x - this.owner.position.x;
      const offsetZ = this.camera.position.z - this.cameraOffset.z - this.owner.position.z;

      if (offsetX !== 0) { this.camera.position.x -= offsetX * delta * this.cameraMovementSpeed; }
      if (offsetZ !== 0) { this.camera.position.z -= offsetZ * delta * this.cameraMovementSpeed; }
    }
    if (currentStateId === PLAYER_STATES.DANCE && this.camera.position.z !== 0) {
      this.camera.position.z = 0;
    }
  }
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      this.input.forward = true;
      break;

    case 37: // left
    case 65: // a
      this.input.left = true;
      break;

    case 40: // down
    case 83: // s
      this.input.backward = true;
      break;

    case 39: // right
    case 68: // d
      this.input.right = true;
      break;
    case 16: // SHIFT
      this.input.shift = true;
      break;
    default:
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      this.input.forward = false;
      break;

    case 37: // left
    case 65: // a
      this.input.left = false;
      break;

    case 40: // down
    case 83: // s
      this.input.backward = false;
      break;

    case 39: // right
    case 68: // d
      this.input.right = false;
      break;
    case 16: // SHIFT
      this.input.shift = false;
      break;
    default:
      break;
  }
}

export { ThirdPersonControls };
