import mongoose from 'mongoose';
import { registerEvents } from './task.events';
import timestamps from "mongoose-timestamp";
import mongoose_delete from "mongoose-delete";
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: String,
    description: String,
    time: [{
        start: Date,
        finish: Date,
        elapsed: Number, //Elapsed time in seconds
    }],
    estimated: Date,
    isStarted: { type: Boolean, default: false },
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    project: { type: Schema.ObjectId, ref: 'Project' },
});

TaskSchema.plugin(deepPopulate);
TaskSchema.plugin(timestamps);
TaskSchema.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

registerEvents(TaskSchema);
export default mongoose.model('Task', TaskSchema);
