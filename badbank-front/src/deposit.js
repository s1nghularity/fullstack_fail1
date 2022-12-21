import React, { useEffect, useContext, useState } from 'react'
import { useUserContext, UserContext} from './context'
import { Card, CardHeader } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

function Deposit( ){
  const context = useContext(UserContext);
  const { user, setUser, userLoggedIn, setUserLoggedIn } = useUserContext(UserContext);
  const [input, setInput] = useState('Enter deposit amount');
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState(context.user[userLoggedIn].transactionHistory);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoggedIn >= 0) {
      setTotal(user[userLoggedIn].balance);
    } else {
      navigate('/login');
    }
  }, []);
  
  function clearError(){
    setError(false);
  }

  function clearForm(){
    setInput('Enter deposit amount');
  }

  function handleChange(event) {
    const input = event.target.value;
    if (input < 0 || isNaN(input)) {
      setError('Positive numerical values only');
    } else {
      clearError(event);
      setSuccess(false)
      setInput(Number(input)); 
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let newTotal = total + input;
    
    if (!error && input > 0) {
      setTotal(user[userLoggedIn].balance = newTotal);
      clearError(event);
      clearForm(event);
      setSuccess('Deposit Successful');
      setTransactions('Deposit', input)};
      updateTransactions(input);
  }

//log successful deposit to alldata.js file
  function updateTransactions(input) {
    let newTransaction = {
      type: 'Deposit',
      amount: input,
      date: new Date().toLocaleString()
    }
    let newTransactions = [...transactions, newTransaction];
    context.user[userLoggedIn].transactionHistory = newTransactions;
  }

  
  return (
    <UserContext.Provider value={{ user, setUser }}>

    <Card style={{ width: '35rem', margin: 'auto', marginTop: '5rem' }}>
    <CardHeader style={{ width: '35rem' }}>Your Account Balance: ${ total }</CardHeader>  
      <h2 style={{ textAlign: 'center' }}>Deposit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input
            type=""
            className="form-control"
            id="amount"
            onChange={handleChange}
          />
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

        </div>
        
        
        <button disabled={!input} type="submit" className="btn btn-primary">
          Deposit
        </button>
      </form>
    </Card>

    </UserContext.Provider>
  );
}


export default Deposit;
