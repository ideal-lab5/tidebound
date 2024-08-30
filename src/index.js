// import 'crypto-browserify';
// import 'stream-browserify';
// import 'buffer';
// import 'assert';
// import 'process';


import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import './App.css';
import "./styles.css";

import { Etf } from '@ideallabs/etf.js'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { CodePromise, ContractPromise } from '@polkadot/api-contract';
import abi from './resources/transmutation.json';

import App from "./App";
import { multiaddr } from '@multiformats/multiaddr'
import logo from './resources/logo.png';
import WalletConnect from "./connect/connect.component";
import { EtfContext } from "./EtfContext";
import chainspec from './resources/etfTestSpecRaw.json';
import { initLibp2p } from "./services/libp2p.service";


function Overlay() {
  const [ready, set] = useState(false)
  const [showConnect, setShowConnect] = useState(false);

  const [etf, setEtf] = useState(null)
  const [signer, setSigner] = useState(null);

  const [contract, setContract] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null)
  const [balance, setBalance] = useState(0);

  const [libp2p, setLibp2p] = useState(null);

  const CustomTypes = {
    Island: {
      name: '[u8;32]',
      seed: '[u8;32]',
    }
  };

  useEffect(() => {
    // if (process.env.REACT_APP_WS_URL === undefined || process.env.REACT_APP_CONTRACT_ADDRESS === undefined) {
    //   console.error("Invalid environment variables! Create a .env and specify REACT_APP_WS_URL and REACT_APP_CONTRACT_ADDRESS");
    //   process.kill();
    // }

    handleIDNConnect().then(() => {
      console.log('connected to IDN')
      setupComms()
    });

  }, []);

  const setupComms = async () => {
    const relayAddr = '/ip4/172.26.99.162/tcp/45863/ws/p2p/12D3KooWHWmueJeEjgE1x278rKWmULgGeTgo9vZn7ghKtmSPnjBS'
    const node = await initLibp2p(relayAddr);
    console.log(`Node started with id ${node.peerId.toString()}`)
    const conn = await node.dial(multiaddr(relayAddr))
    console.log('connected to relay')
    // console.log()
    console.log(`Connected to the relay ${conn.remotePeer.toString()}`)

    // Wait for connection and relay to be bind for the example purpose
    node.addEventListener('self:peer:update', (evt) => {
      // Updated self multiaddrs?
      console.log(`Advertising with a relay address of ${node.getMultiaddrs()[0].toString()}`)
    })

    

    setLibp2p(node);
  }

  const handleIDNConnect = async () => {
    await cryptoWaitReady();
    // let ws = process.env.REACT_APP_WS_URL;
    let ws = 'ws://127.0.0.1:9944';
    let etf = new Etf(ws, false)
    await etf.init(chainspec, CustomTypes)
    setEtf(etf)

    const contract = new ContractPromise(etf.api, abi, "5EkLwbc5RUWZ1nroaDBrmx7CBMyqW6VL8DzSXqSgAJZs8WKy");
    setContract(contract);

    const _unsubscribe = await etf.api.rpc.chain.subscribeNewHeads((header) => {
      setLatestBlock(parseInt(header.number));
    });
  }

  const handleSignerChange = useCallback((newSigner) => {
    setSigner(newSigner)
    set(true)
  }, []);

  function handleOnClick() {
    setShowConnect(true)
  }

  return (
    <>
      <EtfContext.Provider value={{ etf, signer, contract, balance, libp2p }} >
        <App />
        <div className="overlay" />
        <div className={`fullscreen bg ${ready ? "ready" : "notready"} ${ready && "clicked"}`}>
          <div className="start-screen">
            {/* Background Image
          <div className="background-image"></div> */}

            {/* Main Content */}
            <div className="stack">
              {showConnect ?
                <WalletConnect setSigner={handleSignerChange} setBalance={setBalance} />
                :
                <div className="stack">
                  <img src={logo} alt="Game Logo" className="logo" />
                  <button className="start-button" onClick={handleOnClick}>
                    Enter
                  </button>
                </div>
              }
            </div>

            {/* Footer */}
            <div className="footer">
              <p>© 2024 Ideal Labs. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </EtfContext.Provider>
    </>
  )
}

createRoot(document.getElementById("root")).render(<Overlay />)
