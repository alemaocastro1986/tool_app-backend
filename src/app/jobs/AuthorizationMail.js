import Mail from '../services/Mail';

class AuthorizationMail {
  get key() {
    return 'AuthorizationMail';
  }

  async handle({ data }) {
    const { authorizing, client } = data;
    await Mail.sendMail({
      to: `${authorizing.name} <${authorizing.email}>`,
      subject: 'Liberação de ferramenta',
      template: 'authorization',
      context: {
        authorizing,
        client,
      },
    });
  }
}

export default new AuthorizationMail();
