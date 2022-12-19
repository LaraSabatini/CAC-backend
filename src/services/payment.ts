import pool  from '../database/index';
import PaymentInterface from '../interfaces/Payment'

const createPayment = async (req: any, res: any) => {
  try {
      const { clientId, mpUser, paymentExpireDate, item, pricePaid }: PaymentInterface = req.body;

      const registerPayment = await pool.query(`INSERT INTO payments (clientId, mpUser, paymentExpireDate, item, pricePaid) VALUES ('${clientId}', '${mpUser}', '${paymentExpireDate}', '${item}', '${pricePaid}');`);

      if (registerPayment) {
      res.status(200).json({ message: 'Payment registered successfully' });
      }
  } catch (error) {
      return res.status(500).json({ message: 'An error has occurred while registering the payment, please try again.' });
  }
};
  
export {createPayment}