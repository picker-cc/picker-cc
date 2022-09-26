import {bootstrap} from "@picker-cc/core";

import { devConfig } from './dev-config'

bootstrap(devConfig)
    .then(app => {
        // if (process.env.RUN_JOB_QUEUE === '1') {
        //     app.get(JobQueueService).start()
        // }
        // const prismaClient = new (requirePrismaClient(cwd).PrismaClient)({
        //     datasources: { sqlite: { url: dbUrl } },
        // });
    })
    .catch(err => {
        // tslint:disable-next-line
        console.log(err)
        process.exit(1)
    })
