/* globals describe, expect, it, beforeEach, afterEach */

const app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

let newProject;

describe('Project API:', function () {

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

    describe('GET /api/projects', function () {
        let projects;

        beforeEach(function (done) {
            request(app)
                .get('/api/projects')
                .set('authorization', 'Bearer ' + token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    projects = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(projects).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/projects', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/projects')
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'New Project',
                    description: 'This is the brand new project!!!',
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newProject = res.body;
                    done();
                });
        });

        it('should respond with the newly created project', function () {
            expect(newProject.name).to.equal('New Project');
            expect(newProject.description).to.equal('This is the brand new project!!!');
            expect(newProject.user).to.equal(user._id.toString());
        });
    });

    describe('GET /api/projects/:id', function () {
        let project;

        beforeEach(function (done) {
            request(app)
                .get(`/api/projects/${newProject._id}`)
                .set('authorization', 'Bearer ' + token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    project = res.body;
                    done();
                });
        });

        afterEach(function () {
            project = {};
        });

        it('should respond with the requested project', function () {
            expect(project.name).to.equal('New Project');
            expect(project.description).to.equal('This is the brand new project!!!');
        });
    });

    describe('PUT /api/projects/:id', function () {
        let updatedProject;

        beforeEach(function (done) {
            request(app)
                .put(`/api/projects/${newProject._id}`)
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'Updated Project',
                    description: 'This is the updated project!!!'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    updatedProject = res.body;
                    done();
                });
        });

        afterEach(function () {
            updatedProject = {};
        });

        it('should respond with the updated project', function () {
            expect(updatedProject.name).to.equal('Updated Project');
            expect(updatedProject.description).to.equal('This is the updated project!!!');
        });

        it('should respond with the updated project on a subsequent GET', function (done) {
            request(app)
                .get(`/api/projects/${newProject._id}`)
                .set('authorization', 'Bearer ' + token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let project = res.body;

                    expect(project.name).to.equal('Updated Project');
                    expect(project.description).to.equal('This is the updated project!!!');

                    done();
                });
        });
    });

    describe('PATCH /api/projects/:id', function () {
        let patchedProject;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/projects/${newProject._id}`)
                .set('authorization', 'Bearer ' + token)
                .send([
                    { op: 'replace', path: '/name', value: 'Patched Project' },
                    { op: 'replace', path: '/description', value: 'This is the patched project!!!' }
                ])
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    patchedProject = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedProject = {};
        });

        it('should respond with the patched project', function () {
            expect(patchedProject.name).to.equal('Patched Project');
            expect(patchedProject.description).to.equal('This is the patched project!!!');
        });
    });

    describe('DELETE /api/projects/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/projects/${newProject._id}`)
                .set('authorization', 'Bearer ' + token)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when project does not exist', function (done) {
            request(app)
                .delete(`/api/projects/${newProject._id}`)
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
