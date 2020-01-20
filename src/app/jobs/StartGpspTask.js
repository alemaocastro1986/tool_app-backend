import * as Sentry from '@sentry/node';
import GpspService from '../services/Gpsp';
import task from '../services/resources/Gpsp';

class StartGpspTask {
  get key() {
    return 'StartGpspTask';
  }

  async handle({ data }) {
    try {
      const { id, client, items } = data;

      await GpspService.updateTask(
        {
          ...task,
          title: `REGISTRO DE NÃO CONFORMIDADE DE RESERVA | CLIENTE: ${client.name.toUpperCase()} `,
          description: `order_id: ${id}`,
          listCheckList: [
            ...task.listCheckList,
            {
              $id: '22',
              id: 618597,
              kindOfQuestion: {
                $id: '23',
                id: 3,
                description: 'Múltipla escolha',
                creationDate: null,
                dateUpdated: null,
              },
              question: 'Selecione as ferramentas danificadas?',
              answers: items,
              variables: null,
              order: 1,
              creationDate: '2020-01-13T16:13:54',
              dateUpdated: null,
            },
          ],
        },
        1
      );
    } catch (e) {
      Sentry.captureException(e);
    }
  }
}

export default new StartGpspTask();
