import Mail from '../../../src/app/services/Mail';

describe('Mail Service', () => {
  test('Should call function', async () => {
    const result = await Mail.sendMail({
      to: `Andrius Cunha <andrius.castro@gpssa.com.br>`,
      subject: 'Liberação de ferramenta',
      template: 'authorization',
      context: {
        authorizing: { name: 'Andrius Cunha' },
        client: {
          name: 'John Doo',
          register: 'unknow',
          company: {
            name: 'tools stagiary',
          },
        },
      },
    });

    expect(result.response).toMatch(/2.0.0 OK/);
  });
});
