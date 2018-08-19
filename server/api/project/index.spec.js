/* globals sinon, describe, expect, it */

const proxyquire = require('proxyquire').noPreserveCache();

let projectCtrlStub = {
    index: 'projectCtrl.index',
    show: 'projectCtrl.show',
    create: 'projectCtrl.create',
    upsert: 'projectCtrl.upsert',
    patch: 'projectCtrl.patch',
    destroy: 'projectCtrl.destroy'
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
let projectIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    '../../auth/auth.service': authServiceStub,
    './project.controller': projectCtrlStub,
});

describe('Project API Router:', function () {
    it('should return an express router instance', function () {
        expect(projectIndex).to.equal(routerStub);
    });

    describe('GET /api/projects', function () {
        it('should route to project.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'authService.isAuthenticated', 'projectCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    describe('GET /api/projects/:id', function () {
        it('should route to project.controller.show', function () {
            expect(routerStub.get
                .withArgs('/:id', 'authService.isAuthenticated', 'projectCtrl.show')
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/projects', function () {
        it('should route to project.controller.create', function () {
            expect(routerStub.post
                .withArgs('/', 'authService.isAuthenticated', 'projectCtrl.create')
            ).to.have.been.calledOnce;
        });
    });

    describe('PUT /api/projects/:id', function () {
        it('should route to project.controller.upsert', function () {
            expect(routerStub.put
                .withArgs('/:id', 'authService.isAuthenticated', 'projectCtrl.upsert')
            ).to.have.been.calledOnce;
        });
    });

    describe('PATCH /api/projects/:id', function () {
        it('should route to project.controller.patch', function () {
            expect(routerStub.patch
                .withArgs('/:id', 'authService.isAuthenticated', 'projectCtrl.patch')
            ).to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/projects/:id', function () {
        it('should route to project.controller.destroy', function () {
            expect(routerStub.delete
                .withArgs('/:id', 'authService.isAuthenticated', 'projectCtrl.destroy')
            ).to.have.been.calledOnce;
        });
    });
});
