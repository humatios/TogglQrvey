/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tasks              ->  index
 * POST    /api/tasks              ->  create
 * GET     /api/tasks/:id          ->  show
 * PUT     /api/tasks/:id          ->  upsert
 * PATCH   /api/tasks/:id          ->  patch
 * DELETE  /api/tasks/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import Task from './task.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function (entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch (err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.delete()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        console.log(err);
        res.status(statusCode).send(err);
    };
}

export function start(req, res) {
    const userId = req.user._id;
    const query = { _id: req.params.id, user: userId };
    return Task.findById(query).exec()
        .then(handleEntityNotFound(res))
        .then((entity) => {
            if (entity.isStarted) return entity;

            let data = {};
            data.time = entity.time ? entity.time : [];
            data.isStarted = entity.isStarted;
            data.time.push({ start: new Date() });
            data.isStarted = true;
            return Task.update(query, data)
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function stop(req, res) {
    const userId = req.user._id;
    const query = { _id: req.params.id, user: userId };
    return Task.findById(query).exec()
        .then(handleEntityNotFound(res))
        .then((entity) => {
            if (!entity.isStarted) return entity;

            let data = {};
            const last = entity.time.length - 1;
            data.time = entity.time ? entity.time : [];
            data.isStarted = false;
            data.time[last].finish = new Date();
            data.time[last].elapsed = (data.time[last].finish - data.time[last].start) / 1000;
            return Task.update(query, data)
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a list of Tasks
export function index(req, res) {
    const userId = req.user._id;
    const query = { user: userId };
    return Task.find(query).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Task from the DB
export function show(req, res) {
    const userId = req.user._id;
    const query = { _id: req.params.id, user: userId };
    return Task.findById(query).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Task in the DB
export function create(req, res) {
    let data = req.body;
    data.user = req.user._id;
    let isStarted = req.body.isStarted;
    if (isStarted) {
        data.isStarted = true;
        data.time = [];
        data.time.push({ start: new Date() })
    }
    return Task.create(data)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Upserts the given Task in the DB at the specified ID
export function upsert(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Task in the DB
export function patch(req, res) {
    if (req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Task.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Task from the DB
export function destroy(req, res) {
    return Task.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}
