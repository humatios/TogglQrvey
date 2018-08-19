/**
 * Task model events
 */

import {EventEmitter} from 'events';
var TaskEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TaskEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Task) {
  for(var e in events) {
    let event = events[e];
    Task.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    TaskEvents.emit(event + ':' + doc._id, doc);
    TaskEvents.emit(event, doc);
  };
}

export {registerEvents};
export default TaskEvents;
