import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { createLibp2p } from 'libp2p'
import { fromString, toString } from 'uint8arrays'


export const initLibp2p = async () => {
  const libp2p = await createLibp2p({
    transports: [
      webSockets({
        // this allows non-secure WebSocket connections for purposes of the demo
        filter: filters.all
      }),
      circuitRelayTransport({
        discoverRelays: 2
      })
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    connectionGater: {
      denyDialMultiaddr: () => {
        // by default we refuse to dial local addresses from browsers since they
        // are usually sent by remote peers broadcasting undialable multiaddrs and
        // cause errors to appear in the console but in this example we are
        // explicitly connecting to a local node so allow all addresses
        return false
      }
    },
    services: {
      identify: identify(),
      pubsub: gossipsub(),
      dcutr: dcutr()
    },
    connectionManager: {
      minConnections: 0
    }
  })

  // // add event listeners
  // // connection:open
  // libp2p.addEventListener('connection:open', () => {
  //   console.log("libp2p connection:open")
  //   updatePeerList(libp2p)
  // })

  // // connection:close
  // libp2p.addEventListener('connection:close', () => {
  //   console.log("libp2p connection:close")
  //   updatePeerList(libp2p)
  // })

  // // self:peer:update
  // libp2p.addEventListener('self:peer:update', () => {
  //   console.log("self:peer:update")
  //   const multiaddrs = libp2p.getMultiaddrs()
  //     .map((ma) => {
  //       console.log(ma)
  //       // const el = document.createElement('li')
  //       // el.textContent = ma.toString()
  //       // return el
  //     })
  //   // DOM.listeningAddressesList().replaceChildren(...multiaddrs)
  // })


  return libp2p;
}

const updatePeerList = (libp2p) => {
  console.log("update peer list");
  // Update connections list
  libp2p.getPeers()
    .map(peerId => {
      for (const conn of libp2p.getConnections(peerId)) {
        let peerAddr = conn.remoteAddr.toString()
        console.log(peerAddr)
      }
    })
}