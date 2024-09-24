import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CurrencyTable = () => {
  const [rates, setRates] = useState({});
  const [error, setError] = useState(null);
  const currencies = ['CAD', 'IDR', 'JPY', 'CHF', 'EUR', 'GBP'];
  
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(`https://api.currencyfreaks.com/latest`, {
          params: {
            apikey: process.env.REACT_APP_CURRENCY_API_KEY,
            symbols: currencies.join(',')
          }
        });
        setRates(response.data.rates);
        setError(null); // Reset error if successful
      } catch (error) {
        setError('Failed to fetch currency rates. Please check your API key.');
      }
    };
    fetchRates();
  }, []);
  
  const calculateBuySell = (rate) => {
    const weBuy = (rate * 0.95).toFixed(2); // Example: buy at 95% of rate
    const weSell = (rate * 1.05).toFixed(2); // Example: sell at 105% of rate
    return { weBuy, weSell };
  };

  const exampleData = [
    { currency: 'CAD', weBuy: '1.38', rate: '1.35', weSell: '1.33' },
    { currency: 'IDR', weBuy: '15493.97', rate: '15190.17', weSell: '14886.37' },
    { currency: 'JPY', weBuy: '146.55', rate: '143.67', weSell: '140.80' },
    { currency: 'CHF', weBuy: '0.86', rate: '0.85', weSell: '0.83' },
    { currency: 'EUR', weBuy: '0.92', rate: '0.90', weSell: '0.88' },
    { currency: 'GBP', weBuy: '0.76', rate: '0.75', weSell: '0.73' }
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center">Currency Exchange Rates</h1>
      <p className="text-muted text-center">
        This table displays live exchange rates for CAD, IDR, JPY, CHF, EUR, and GBP based on USD. It also includes "We Buy" and "We Sell" columns, showing exchange rates at which we buy or sell each currency.
      </p>

      {error && (
        <>
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
          <h3 className="text-center mt-4">Example Exchange Rates</h3>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Currency</th>
                <th scope="col">We Buy</th>
                <th scope="col">Exchange Rate (USD)</th>
                <th scope="col">We Sell</th>
              </tr>
            </thead>
            <tbody>
              {exampleData.map((data) => (
                <tr key={data.currency}>
                  <td>{data.currency}</td>
                  <td>{data.weBuy}</td>
                  <td>{data.rate}</td>
                  <td>{data.weSell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!error && (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Currency</th>
              <th scope="col">We Buy</th>
              <th scope="col">Exchange Rate (USD)</th>
              <th scope="col">We Sell</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency) => {
              const rate = rates[currency];
              if (!rate) return null;
              const { weBuy, weSell } = calculateBuySell(rate);
              return (
                <tr key={currency}>
                  <td>{currency}</td>
                  <td>{weBuy}</td>
                  <td>{rate}</td>
                  <td>{weSell}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CurrencyTable;
