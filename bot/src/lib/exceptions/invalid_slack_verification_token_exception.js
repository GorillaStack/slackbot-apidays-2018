import ChatbotException from './chatbot_exception';

export default class InvalidSlackVerificationTokenException extends ChatbotException {
  constructor(token) {
    super(`Invalid slack verification token '${token}' recieved`);
  }
}
