/**
 * Task
 *
 * @file Task
 * @author master
 *
 * 任务管理
 */

class Task {
    constructor(config) {
        this.taskList = [];
        this.state = {
            config: config,
        };
    }

    add(task) {
        if (typeof task !== 'function') {
            throw new TypeError('task must be a function!');
        }
        this.taskList.push(task);
        return this;
    }

    next() {
        if (this.taskList.length) {
            const task = this.taskList.shift();
            task.call(this, this.state, this.next.bind(this));
        }
    }

    run() {
        this.next();
        return this;
    }
}

module.exports = Task;
