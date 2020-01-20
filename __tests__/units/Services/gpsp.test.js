import GpspService from '../../../src/app/services/Gpsp';
import task from '../../../src/app/services/resources/Gpsp';

const defaultTask = {
  ...task,
  title: `DEVOLUÇÃO DE RESERVA | CLIENTE: John Doo `,
  description: `order_id: 5745543795965952`,
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
      answers: 'answer1:answer2:answer3:answer4',
      variables: null,
      order: 1,
      creationDate: '2020-01-13T16:13:54',
      dateUpdated: null,
    },
  ],
};

describe('GPSp services', () => {
  test('Start task', async () => {
    const response = await GpspService.updateTask(defaultTask, 1);
    expect(response).toBe(defaultTask.id);
  });
});
