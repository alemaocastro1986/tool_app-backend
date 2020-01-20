const task = {
  id: 41553,
  title:
    'REGISTRO DE NÃO CONFORMIDADE DE RESERVA | CLIENTE: ANDRIUS CUNHA CASTRO ',
  single: true,
  technicalSpecifications: null,
  endDateTime: '2020-01-13T16:15:00.000Z',
  company: {
    id: 3545,
  },
  startDateTime: '2020-01-13T16:15:00.000Z',
  businessRole: [
    {
      $id: '18',
      id: 414,
      name: 'ANALISTA LOGISTICO JR',
      description: 'ANALISTA LOGISTICO JR',
      topBusinessRole: null,
      schooling: null,
      minimumCompetence: null,
      listModelTasks: [
        {
          $ref: '1',
        },
      ],
      creationDate: null,
      dateUpdated: null,
    },
  ],
  minimumExperience: {
    id: 3,
  },
  description: 'order_id: dd438227-e0c1-4d85-811a-1eeda003eae',
  attachment: false,
  evidence: true,
  duration: '15',
  stagger: '60',
  actions: {
    $id: '26',
    id: 41573,
    emails: [
      {
        $id: '27',
        id: 157275,
        email: 'andrius.castro@gpssa.com.br',
        creationDate: '2020-01-13T16:13:54',
        dateUpdated: null,
      },
    ],
    idNextTask: 0,
    creationDate: '2020-01-13T13:45:04',
    dateUpdated: null,
  },
  listCheckList: [
    {
      $id: '20',
      id: 618598,
      kindOfQuestion: {
        $id: '21',
        id: 4,
        description: 'Texto Livre',
        creationDate: null,
        dateUpdated: null,
      },
      question: 'Quais as marcas?',
      answers: '(Livre)',
      variables: null,
      order: 2,
      creationDate: '2020-01-13T16:13:54',
      dateUpdated: null,
    },
    {
      $id: '24',
      id: 618599,
      kindOfQuestion: {
        $id: '25',
        id: 4,
        description: 'Texto Livre',
        creationDate: null,
        dateUpdated: null,
      },
      question: 'Descrição sucinta da ocorrência?',
      answers: '(Livre)',
      variables: null,
      order: 3,
      creationDate: '2020-01-13T16:13:54',
      dateUpdated: null,
    },
  ],
  recurrence: null,
  allowsMultipleTasks: false,
  redoTaskCanceled: true,
  signature: true,
  qrCode: false,
  beginRecurrence: 0,
  autoLink: false,
  workFlows: [
    {
      id: 0,
    },
  ],
};
export default task;
