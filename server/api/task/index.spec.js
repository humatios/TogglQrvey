/* globals sinon, describe, expect, it */

const proxyquire = require('proxyquire').noPreserveCache();

let taskCtrlStub = {
    index: 'taskCtrl.index',
    show: 'taskCtrl.show',
    create: 'taskCtrl.create',
    upsert: 'taskCtrl.upsert',
    patch: 'taskCtrl.patch',
    destroy: 'taskCtrl.destroy'
};

let authServiceStub = {
    isAuthenticated() {
        return 'authService.isAuthenticated';
    }
};

let routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy()
};

// require the index with our stubbed out modules
let taskIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    '../../auth/auth.service': authServiceStub,
    './task.controller': taskCtrlStub
});

describe('Task API Router:', function () {
    it('should return an express router instance', function () {
        expect(taskIndex).to.equal(routerStub);
    });

    describe('GET /api/tasks', function () {
        it('should route to task.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'authService.isAuthenticated', 'taskCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    describe('GET /api/tasks/:id', function () {
        it('should route to task.controller.show', function () {
            expect(routerStub.get
                .withArgs('/:id', 'authService.isAuthenticated', 'taskCtrl.show')
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/tasks', function () {
        it('should route to task.controller.create', function () {
            expect(routerStub.post
                .withArgs('/', 'authService.isAuthenticated', 'taskCtrl.create')
            ).to.have.been.calledOnce;
        });
    });

    describe('PUT /api/tasks/:id', function () {
        it('should route to task.controller.upsert', function () {
            expect(routerStub.put
                .withArgs('/:id', 'authService.isAuthenticated', 'taskCtrl.upsert')
            ).to.have.been.calledOnce;
        });
    });

    describe('PATCH /api/tasks/:id', function () {
        it('should route to task.controller.patch', function () {
            expect(routerStub.patch
                .withArgs('/:id', 'authService.isAuthenticated', 'taskCtrl.patch')
            ).to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/tasks/:id', function () {
        it('should route to task.controller.destroy', function () {
            expect(routerStub.delete
                .withArgs('/:id', 'authService.isAuthenticated', 'taskCtrl.destroy')
            ).to.have.been.calledOnce;
        });
    });
});
