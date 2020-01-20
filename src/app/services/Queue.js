import Bull from 'bull';
import * as Sentry from '@sentry/node';
import redisConfig from '../../config/redis';

import AuthorizationMail from '../jobs/AuthorizationMail';
import StartGpspTask from '../jobs/StartGpspTask';
import ChangeStockMail from '../jobs/ChangeStockMail';

const jobs = [AuthorizationMail, StartGpspTask, ChangeStockMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bull: new Bull(key, {
          redis: redisConfig,
        }),
        name: key,
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bull.add(job);
  }

  processQueue() {
    jobs.forEach(job => {
      const { bull, handle } = this.queues[job.key];
      bull.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    Sentry.captureException(err);
  }
}

export default new Queue();
