import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../components/socket/socket.service';

type Project = {
    name: string;
    description?: string;
};
type Task = {
    name: String;
    description?: String;
    estimated?: Date;
    time?: Array;
    isStarted: Boolean;
    project?: Object;
}

@Component({
    selector: 'main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent implements OnInit, OnDestroy {
    SocketService;
    awesomeProjects: Project[] = [];
    newProject = {};

    awesomeTask: Task[] = [];
    newTask = {};

    static parameters = [HttpClient, SocketService];
    constructor(http: HttpClient, socketService: SocketService) {
        this.http = http;
        this.SocketService = socketService;
    }

    ngOnInit() {
        this.getProjects();
        this.getTasks();
    }

    getProjects() {
        return this.http.get('/api/projects')
            .subscribe((projects: Project[]) => {
                this.awesomeProjects = projects;
                this.SocketService.syncUpdates('project', this.awesomeProjects);
            });
    }

    getTasks() {
        return this.http.get('/api/tasks')
            .subscribe((tasks: Task[]) => {
                tasks.forEach((task) => {
                    let total = new Date(0, 0, 0, 0, 0, 0);
                    let subtotal = 0;
                    task.time.forEach((time) => {
                        if (time.elapsed) {
                            let elapsed = new Date(0, 0, 0, 0, 0, 0);
                            subtotal += time.elapsed;
                            elapsed.setSeconds(time.elapsed);
                            time.elapsed = elapsed;
                        }
                    });
                    total.setSeconds(subtotal);
                    task.total = total;
                });
                console.log(tasks);

                this.awesomeTasks = tasks;
                this.SocketService.syncUpdates('task', this.awesomeTasks);
            });
    }


    ngOnDestroy() {
        this.SocketService.unsyncUpdates('project');
        this.SocketService.unsyncUpdates('task');
    }

    addProject() {
        if (this.newProject) {
            return this.http.post('/api/projects', this.newProject)
                .subscribe(project => {
                    console.log('Added Project:', project);
                    this.newProject = {};
                });
        }
    }

    addTask() {
        if (this.newTask) {
            return this.http.post('/api/tasks', this.newTask)
                .subscribe(task => {
                    console.log('Added Task:', task);
                    this.newTask = {};
                });
        }
    }

    startTime(id) {
        return this.http.get('/api/tasks/start/' + id)
            .subscribe(task => {
                this.ngOnInit();
                this.SocketService.syncUpdates('task', this.awesomeTasks);
            });
    }

    stopTime(id) {
        return this.http.get('/api/tasks/stop/' + id)
            .subscribe(task => {
                this.ngOnInit();
                this.SocketService.syncUpdates('task', this.awesomeTasks);
            });
    }

    deleteProject(project) {
        return this.http.delete(`/api/projects/${project._id}`)
            .subscribe(() => {
                console.log('Deleted Project');
            });
    }
}
