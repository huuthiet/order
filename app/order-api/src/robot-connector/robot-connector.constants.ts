export enum RobotStatus {
  IDLE = 'IDLE'
};

export enum RaybotCommandTypes {
  STOP = 'STOP',
  MOVE_FORWARD = 'MOVE_FORWARD',
  MOVE_BACKWARD = 'MOVE_BACKWARD',
  OPEN_BOX = 'OPEN_BOX',
  CLOSE_BOX = 'CLOSE_BOX',
  WAIT_GET_ITEM = 'WAIT_GET_ITEM',
  DROP_BOX = 'DROP_BOX',
  LIFT_BOX = 'LIFT_BOX',
  MOVE_TO_LOCATION = 'MOVE_TO_LOCATION',
  CHECK_QR = 'CHECK_QR',
}

export enum RaybotMoveToLocationDirections {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
}