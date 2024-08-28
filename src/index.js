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
import { createHelia } from 'helia';
import { createOrbitDB } from '@orbitdb/core';
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { identify } from "@libp2p/identify";
import { createLibp2p } from 'libp2p'
import logo from './resources/logo.png';
import WalletConnect from "./connect/connect.component";
import { EtfContext } from "./EtfContext";
import chainspec from './resources/etfTestSpecRaw.json';


function Overlay() {
  const [ready, set] = useState(false)
  const [showConnect, setShowConnect] = useState(false);

  const [etf, setEtf] = useState(null)
  const [signer, setSigner] = useState(null);

  const [contract, setContract] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null)
  const [balance, setBalance] = useState(0);

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
      setupOrbitDb()
    });

  }, []);

  const setupOrbitDb = async () => {
    const Libp2pOptions = {
      services: {
        pubsub: gossipsub({
          // neccessary to run a single peer
          allowPublishToZeroTopicPeers: true
        }),
        identify: identify()
      }
    }

    const libp2p = await createLibp2p({ ...Libp2pOptions })
    const ipfs = await createHelia({ libp2p })
    const orbitdb = await createOrbitDB({ ipfs })

    // Create / Open a database. Defaults to db type "events".
    const db = await orbitdb.open("hello")

    const address = db.address
    console.log(address)
    // "/orbitdb/zdpuAkstgbTVGHQmMi5TC84auhJ8rL5qoaNEtXo2d5PHXs2To"
    // The above address can be used on another peer to open the same database

    // Listen for updates from peers
    db.events.on("update", async entry => {
      console.log(entry)
      const all = await db.all()
      console.log(all)
    })

    // Add an entry
    const hash = await db.add("world")
    console.log(hash)

    // Query
    for await (const record of db.iterator()) {
      console.log(record)
    }

    await db.close()
    await orbitdb.stop()
    await ipfs.stop()
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
      <EtfContext.Provider value={{ etf, signer, contract, balance }} >
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
