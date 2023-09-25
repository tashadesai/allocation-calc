import "./App.css";
import React, { useState, useEffect } from "react";
import { Input, Select, Row, Col, Card } from "antd";
import axios from "axios";

function App() {
  const [rates, setRates] = useState({});
  const [investable, setInvestable] = useState();
  const [allocation, setAllocation] = useState({BTC:0, ETH:0});

  useEffect(() => {
    axios.get("https://api.coinbase.com/v2/exchange-rates?currency=USD")
      .then(res => {
        let temp = {};
        for (let curr in res.data.data.rates) {
          if (["BTC", "ETH"].includes(curr)) {
            temp[curr] = res.data.data.rates[curr];
          }
        }
        setRates(temp)
      })
  }, [])

  function handleChange(e) {
    let val = e.target.value.replace(/[^0-9]/g, '');
    val = (val.length === 2 ? "0" : val.length === 1 ? "00" : "") + val;
    val = val.slice(0,-2) + "." + val.slice(-2);

    let valNum = parseFloat(val);
    !valNum ? setAllocation({BTC:0, ETH:0}) : setAllocation({ BTC: (valNum * .7 * rates.BTC).toFixed(8), ETH: (valNum * .3 * rates.ETH).toFixed(8), });

    setInvestable(parseInt(val.split(".")[0]).toLocaleString() + "." + val.split(".")[1]);
  }

  return (
    <div>
      <Card bordered={false} title="Asset Allocation Calculator" className="top-2 mw5 mw6-ns center pa3 flex-column" id="main">
        <div className="f5 pt2 flex items-end">
          <div className="pr2">Investable Assets:</div>
          <Input value={investable} className="mw5 f5" placeholder="0.00" onChange={handleChange} id="investable" prefix="$" suffix="USD"/>
          </div>
        <div className="f5 pv4 flex">
          70% BTC Allocation:
          <div className="b pl2">{allocation.BTC}</div>
        </div>
        <div className="f5 flex">
          30% ETH Allocation:
          <div className="b pl2">{allocation.ETH}</div>
        </div>
      </Card>
    </div>
  );
}

export default App;
