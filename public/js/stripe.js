// import axios from 'axios';
// const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51IqwTSSDDW3HcKMjyFXqlvDD7oVQmzjWitApI1Pc8Bltmeto6uxlZ9SXvUhWEcN64o6JLghI7qiUvIEECigBnI9V00v4qISulL');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
