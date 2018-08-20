import mongoose from 'mongoose';
import { registerEvents } from './project.events';
import timestamps from "mongoose-timestamp";
import mongoose_delete from "mongoose-delete";
import Task from "../task/task.model";
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: String,
    description: String,
    user: { type: Schema.ObjectId, ref: 'User' },
});

ProjectSchema.plugin(deepPopulate);
ProjectSchema.plugin(timestamps);
ProjectSchema.plugin(mongoose_delete, { overrideMethods: 'all', deletedAt: true });

ProjectSchema
    .virtual('task')
    .get(function () {
        return Task.find({ project: this._id }).exec();
    });

registerEvents(ProjectSchema);
export default mongoose.model('Project', ProjectSchema);
