import React from 'react';
import PropTypes from 'prop-types';
import style from './balance.module.css';

const Balance = ({ transactions, sumOfAmountByTypes }) => (
  <section className={style.balance}>
    <p>
      <span className={style.arrowUp}>⬆</span>
      <span>
        {(
          Math.round(sumOfAmountByTypes(transactions, 'deposit') * 100) / 100
        ).toFixed(2)}
        $
      </span>
    </p>
    <p>
      <span className={style.arrowDown}>⬇</span>
      <span>
        {(
          Math.round(sumOfAmountByTypes(transactions, 'withdraw') * 100) / 100
        ).toFixed(2)}
        $
      </span>
    </p>
    <span className={style.container}>
      Balance:{' '}
      {(
        Math.round(
          (sumOfAmountByTypes(transactions, 'deposit') -
            sumOfAmountByTypes(transactions, 'withdraw')) *
            100,
        ) / 100
      ).toFixed(2)}
      $
    </span>
  </section>
);

Balance.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  sumOfAmountByTypes: PropTypes.func.isRequired,
};

export default Balance;
