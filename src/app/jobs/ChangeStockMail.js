import Mail from '../services/Mail';

class ChangeStockMail {
  get key() {
    return 'ChangeStockMail';
  }

  async handle({ data }) {
    const { user, stockHistory } = data;

    await Mail.sendMail({
      to: `Andrius Cunha Castro <andrius.castro@gpssa.com.br>`,
      subject: 'Alteração de Estoque',
      template: 'changeStock',
      context: {
        user,
        stock: stockHistory,
      },
      attachments: [
        {
          filename: '5010643-637075369908896580-16x9.jpg',
          path:
            'https://cdn.lynda.com/course/5010643/5010643-637075369908896580-16x9.jpg',
          cid: '5010643-637075369908896580-16x9.jpg',
        },
      ],
    });
  }
}

export default new ChangeStockMail();
