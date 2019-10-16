import React from 'react';
import shortid from 'shortid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Controls from '../Controls/Controls';
import Balance from '../Balance/Balance';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import style from './dashboard.module.css';

class Dashboard extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    transactions: [],
    amount: '',
  };

  componentDidMount() {
    const fromLS = localStorage.getItem('transactions')
      ? JSON.parse(localStorage.getItem('transactions'))
      : [];
    return this.setState({ transactions: fromLS });
  }

  componentDidUpdate(prevProps, prevState) {
    const { transactions } = this.state;
    return (
      prevState.transactions.length !== transactions.length &&
      localStorage.setItem('transactions', JSON.stringify(transactions))
    );
  }

  notifyAmountNull = () =>
    toast('Введите сумму для проведения операции!', {
      containerId: 'amountControl',
    });

  notifyNotWithdraw = () =>
    toast('На счету недостаточно средств для проведения операции!', {
      containerId: 'amountControl',
    });

  notifyInputInvalid = () =>
    toast(`Введена не корректная сумма ${this.state.amount}. Повторите ввод!`, {
      containerId: 'amountControl',
    });

  handleInputChange = ({ target }) => {
    const { value } = target;
    const amountInput = Number(value) >= 0 ? value : String(Math.abs(value));

    return this.setState({
      amount: amountInput,
    });
  };

  sumOfAmountByTypes = (transactions, typeTransaction) => {
    return transactions
      .filter(t => t.type === typeTransaction)
      .reduce((acc, t) => acc + Number(t.amount), 0);
  };

  handleControlBtn = ({ target }) => {
    const timeTransaction = new Date();
    const { amount, transactions } = this.state;
    const exp = /^0\d+/g;
    const transaction = {
      id: shortid.generate(),
      amount: Number(amount),
      time: timeTransaction.toLocaleString(),
    };

    if (!Number(amount)) {
      return this.notifyAmountNull();
    }

    if (exp.test(amount)) {
      this.setState({ amount: '' });
      return this.notifyInputInvalid();
    }

    if (target.name === 'deposit') {
      transaction.type = 'deposit';
    } else if (target.name === 'withdraw') {
      if (
        Number(amount) >
        this.sumOfAmountByTypes(transactions, 'deposit') -
          this.sumOfAmountByTypes(transactions, 'withdraw')
      ) {
        return this.notifyNotWithdraw();
      }

      transaction.type = 'withdraw';
    }

    return this.setState(prev => ({
      transactions: [transaction, ...prev.transactions],
      amount: '',
    }));
  };

  render() {
    const { amount, transactions } = this.state;
    return (
      <div className={style.dashboard}>
        <Controls
          amount={amount}
          onInputChange={this.handleInputChange}
          onControlBtn={this.handleControlBtn}
        />
        <Balance
          transactions={transactions}
          sumOfAmountByTypes={this.sumOfAmountByTypes}
        />
        <TransactionHistory transactions={transactions} />
        <ToastContainer
          enableMultiContainer
          containerId="amountControl"
          position={toast.POSITION.BOTTOM_RIGHT}
        />
      </div>
    );
  }
}

export default Dashboard;
