/* globals describe, expect, it, beforeEach, afterEach */

const app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

let newTask;

describe('Task API:', function () {
    let user;
    // Clear users before testing
    before(function () {
        return User.remove().then(function () {
            user = new User({
                name: 'Fake User',
                email: 'test@example.com',
                password: 'password'
            });
            return user.save();
        });
    });

    let token;
    before(function (done) {
        request(app)
            .post('/auth/local')
            .send({
                email: 'test@example.com',
                password: 'password'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    // Clear users after testing
    after(function () {
        return User.remove();
    });

    describe('GET /api/tasks', function () {
        let tasks;

        beforeEach(function (done) {
            request(app)
                .get('/api/tasks')
                .set('authorization', 'Bearer ' + token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    tasks = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(tasks).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/tasks', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/tasks')
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'New Task',
                    description: 'This is the brand new task!!!'
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newTask = res.body;
                    done();
                });
        });

        it('should respond with the newly created task', function () {
            expect(newTask.name).to.equal('New Task');
            expect(newTask.description).to.equal('This is the brand new task!!!');
            expect(newTask.user).to.equal(user._id.toString());
        });
    });

    describe('GET /api/tasks/:id', function () {
        let task;

        beforeEach(function (done) {
            request(app)
                .get(`/api/tasks/${newTask._id}`)
                .set('authorization', 'Bearer ' + token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    task = res.body;
                    done();
                });
        });

        afterEach(function () {
            task = {};
        });

        it('should respond with the requested task', function () {
            expect(task.name).to.equal('New Task');
            expect(task.description).to.equal('This is the brand new task!!!');
        });
    });

    // describe('GET /api/tasks/start/:id', function () {
    //     let task;

    //     beforeEach(function (done) {
    //         request(app)
    //             .get(`/api/tasks/start/${newTask._id}`)
    //             .set('authorization', 'Bearer ' + token)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 task = res.body;
    //                 done();
    //             });
    //     });

    //     afterEach(function () {
    //         task = {};
    //     });

    //     it('should start the requested task', function () {
    //         expect(task.time).to.be.instanceOf(Array);
    //         expect(task.time.length).to.equal(1);
    //         expect(task.isStarted).to.be.true;
    //     });
    // });

    describe('PUT /api/tasks/:id', function () {
        let updatedTask;

        beforeEach(function (done) {
            request(app)
                .put(`/api/tasks/${newTask._id}`)
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'Updated Task',
                    description: 'This is the updated task!!!'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    updatedTask = res.body;
                    done();
                });
        });

        afterEach(function () {
            updatedTask = {};
        });

        it('should respond with the updated task', function () {
            expect(updatedTask.name).to.equal('Updated Task');
            expect(updatedTask.description).to.equal('This is the updated task!!!');
        });

        it('should respond with the updated task on a subsequent GET', function (done) {
            request(app)
                .get(`/api/tasks/${newTask._id}`)
                .set('authorization', 'Bearer ' + token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let task = res.body;

                    expect(task.name).to.equal('Updated Task');
                    expect(task.description).to.equal('This is the updated task!!!');

                    done();
                });
        });
    });

    describe('PATCH /api/tasks/:id', function () {
        let patchedTask;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/tasks/${newTask._id}`)
                .set('authorization', 'Bearer ' + token)
                .send([
                    { op: 'replace', path: '/name', value: 'Patched Task' },
                    { op: 'replace', path: '/description', value: 'This is the patched task!!!' }
                ])
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    patchedTask = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedTask = {};
        });

        it('should respond with the patched task', function () {
            expect(patchedTask.name).to.equal('Patched Task');
            expect(patchedTask.description).to.equal('This is the patched task!!!');
        });
    });

    describe('DELETE /api/tasks/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/tasks/${newTask._id}`)
                .set('authorization', 'Bearer ' + token)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when task does not exist', function (done) {
            request(app)
                .delete(`/api/tasks/${newTask._id}`)
                .set('authorization', 'Bearer ' + token)
                .expect(404)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });
});
