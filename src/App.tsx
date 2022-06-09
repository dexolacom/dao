import React from 'react';
import './App.css';
import VotingPage from './components/Voting/index'
import { ConnectButton } from "tech-web3-connector"
import { RPC } from './components/constants/constants';

function App() {
  return (
    <div className="app">
      <div className='app-content'>
        <ConnectButton RPC={RPC} portisId={"portisId-key-project"} />
        <VotingPage/>
      </div>
    </div>
  );
}

export default App;
