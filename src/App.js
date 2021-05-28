import React, { useEffect, useState } from 'react';
import web3 from './web3';
import lottery from './lottery';

const App = () => {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState(0);
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState('');

  const startup = async () => {
    console.log(web3.version);
    const managerAddress = await lottery.methods.manager().call();
    setManager(managerAddress);

    const playersList = await lottery.methods.getPlayers().call();
    setPlayers(playersList);

    const balanceInContract = await web3.eth.getBalance(lottery.options.address);
    setBalance(balanceInContract);
  };

  useEffect(() => {
    startup();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setMessage('waiting on transaction success....');

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(`${value}`, 'ether'),
      });
      setMessage('You have been entered!');
    } catch (error) {
      setMessage('Failed to enter into lottery. Try again!');
    }
  };

  const handlePickWinner = async (e) => {
    e.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();

      setMessage('waiting on transaction success....');
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      setWinner('Winner A');
    } catch (error) {
      setMessage('Failed to pick winner. Try again!');
    }
  };

  return (
    <>
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is manager by {manager}. There are currently {players.length} people
          entering this lottery, competing to win {web3.utils.fromWei(balance, 'ether')} ether!
        </p>

        <hr />
        <form onSubmit={handleSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>

            <input
              type='number'
              onChange={(e) => setValue(e.currentTarget.value)}
              value={value}
              style={{ display: 'block' }}
            />
            <button style={{ display: 'block' }}>Enter</button>
          </div>
        </form>

        {message && <p>{message}</p>}

        <hr />

        <h2>Time to pick a winner?</h2>
        <button onClick={handlePickWinner}>Pick a winner!</button>

        {winner && <p>{winner} has won!</p>}
      </div>
    </>
  );
};

export default App;
