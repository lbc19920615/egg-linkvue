const MESSAGE_KEY = 'custom-message';

class Message {
  constructor(msg) {
    this.type = 'custom-message';
    this.msg = msg;
  }
}

export class CommandMessage extends Message {
  // eslint-disable-next-line no-useless-constructor
  constructor(name, value) {
    super({
      name,
      value,
    });
  }
}

export function detectIsCustomMessage(data) {
  return data && data.type === MESSAGE_KEY;
}

