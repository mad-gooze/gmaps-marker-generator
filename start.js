'use strict';

const cluster = require('cluster');
const STOP_SIGNALS = [
    'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
];
const PRODUCTION = process.env.NODE_ENV == 'PRODUCTION';

let stopping = false;

cluster.on('disconnect', () => {
    if (PRODUCTION) {
        if (!stopping) {
            cluster.fork();
        }
    } else {
        process.exit(1);
    }
});

if (cluster.isMaster) {
    const workerCount = process.env.NODE_CLUSTER_WORKERS || 4;
    console.log(`Starting ${workerCount} workers...`);
    for (let i = 0; i < workerCount; i++) {
        cluster.fork();
    }
    if (PRODUCTION) {
        STOP_SIGNALS.forEach((signal) => {
            process.on(signal, () => {
                console.log(`Got ${signal}, stopping workers...`);
                stopping = true;
                cluster.disconnect(() => {
                    console.log('All workers stopped, exiting.');
                    process.exit(0);
                });
            });
        });
    }
} else {
    require('./app.js');
}
