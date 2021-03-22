import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51IXPFtIBw8Kv7DihhOtRfaCpfdM8YTJikq888vL3Yr4CI1GFMwXKHbqx0PwVMLi3b5U1LJ5mBVyNBPsr0hjxB5G000Tt7uQkw7'
    );
    // 1) Get  checkout session form API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
