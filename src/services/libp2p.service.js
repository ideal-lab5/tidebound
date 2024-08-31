import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { webRTC } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { webTransport } from '@libp2p/webtransport'
import { createLibp2p } from 'libp2p'
import {PUBSUB_PEER_DISCOVERY} from '../constants';
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'



export const Libp2p = async (relayerMaddr) => {
  const node = await createLibp2p({
    addresses: {
      listen: [
        // 👇 Listen for webRTC connection
        '/webrtc',
      ],
    },
    transports: [
      webSockets({
        // Allow all WebSocket connections inclusing without TLS
        filter: filters.all,
      }),
      webTransport(),
      webRTC(),
      // 👇 Required to create circuit relay reservations in order to hole punch browser-to-browser WebRTC connections
      circuitRelayTransport({
        discoverRelays: 1,
      }),
    ],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    connectionGater: {
      // Allow private addresses for local testing
      denyDialMultiaddr: async () => false,
    },
    peerDiscovery: [
      bootstrap({
        list: [relayerMaddr],
      }),
      pubsubPeerDiscovery({
        interval: 10_000,
        topics: [PUBSUB_PEER_DISCOVERY],
      }),
    ],
    services: {
      pubsub: gossipsub(),
      identify: identify(),
    },
  })

  // setNode(node)

  console.log(`Node started with id ${node.peerId.toString()}`)

  // setup event listeners 

  // Wait for connection and relay to be bind for the example purpose
  node.addEventListener('self:peer:update', (evt) => {
    // Updated self multiaddrs?
    console.log(`Advertising with a relay address of ${JSON.stringify(node.getMultiaddrs())}`)
  })

  // node.services.pubsub.subscribe("test-topic")

  node.services.pubsub.addEventListener('message', event => {
    // const topic = event.detail.topic
    // const message = toString(event.detail.data)
    // console.log(`Message received on topic '${topic}'`)
    console.log(event)
  })

  return node;
}
