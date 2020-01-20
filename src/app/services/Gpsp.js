import 'dotenv/config';

import axios from 'axios';
import { addMinutes, subHours } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import gpspConfig from '../../config/gpsp';

class GpspService {
  constructor() {
    this.service = axios.create({
      baseURL: gpspConfig.host,
    });
  }

  async updateTask(task, delay) {
    const utcDate = subHours(new Date(), 3).toISOString();

    const bodyData = {
      ...task,
      startDateTime: addMinutes(
        zonedTimeToUtc(utcDate, 'America/Sao_Paulo'),
        delay
      ),
      endDateTime: addMinutes(
        zonedTimeToUtc(utcDate, 'America/Sao_Paulo'),
        delay + 30
      ),
    };

    const response = await this.service.put('task', bodyData, {
      params: {
        token: gpspConfig.token,
        id: task.id,
      },
    });
    return response.data;
  }
}

export default new GpspService();
