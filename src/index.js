// import 'crypto-browserify';
// import 'stream-browserify';
// import 'buffer';
// import 'assert';
// import 'process';


import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Footer } from "@pmndrs/branding"
import "./styles.css"

// import { Etf } from '@ideallabs/etf.js'
// import { cryptoWaitReady } from '@polkadot/util-crypto'
// import { CodePromise, ContractPromise } from '@polkadot/api-contract';
// import abi from './resources/transmutation.json';

import App from "./App"

function Overlay() {
  const [ready, set] = useState(false)
  const [etf, setEtf] = useState(null)
  const [signer, setSigner] = useState(null);

  const [contract, setContract] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null)

  useEffect(() => {
    // if (process.env.REACT_APP_WS_URL === undefined || process.env.REACT_APP_CONTRACT_ADDRESS === undefined) {
    //   console.error("Invalid environment variables! Create a .env and specify REACT_APP_WS_URL and REACT_APP_CONTRACT_ADDRESS");
    //   process.kill();
    // }

    // const setup = async () => {
      
    //   await cryptoWaitReady();
    //   let ws = process.env.REACT_APP_WS_URL;
    //   let etf = new Etf(ws, false)
    //   await etf.init()
    //   setEtf(etf)

    //   const contract = new ContractPromise(etf.api, abi, process.env.REACT_APP_CONTRACT_ADDRESS);
    //   setContract(contract);

    //   const _unsubscribe = await etf.api.rpc.chain.subscribeNewHeads((header) => {
    //     setLatestBlock(parseInt(header.number));
    //   });
    // }
    // setup()
  }, []);

  function hanldeOnClick() {
    set(true)
  }

  return (
    <>
      <App />
      <div className="dot" />
      <div className={`fullscreen bg ${ready ? "ready" : "notready"} ${ready && "clicked"}`}>
        <div className="stack">
          <button onClick={hanldeOnClick}>Start</button>
        </div>
      </div>
    </>
  )
}

createRoot(document.getElementById("root")).render(<Overlay />)
