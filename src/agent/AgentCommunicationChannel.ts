import { EventEmitter } from 'events';

export const agentCommunicationChannel = new EventEmitter();

export const EVENT_TYPES = {
    TOOL_REQUEST: 'tool_request',
}