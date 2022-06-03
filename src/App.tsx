import React from 'react';
import './App.css';
import VotingPage from './components/Voting/index'
import { ConnectButton } from "tech-web3-connector"
import { RPC } from './components/constants/constants';

function App() {
  return (
    <div className="App">
      <VotingPage/>
      <ConnectButton  RPC={RPC} portisId={"portisId-key-project"} />
    </div>
  );
}

export default App;
