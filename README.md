# Tidebound

Tidebound is a **fully decentralized**, peer-to-peer web3 game. It is an 'autonomous world' set in a flooded apocalypse where layers are subject to the random wills of the tides. They must overcome to recover the world. 

Tidebound is powered by verifiable randomness from the IDN Randomness beacon. It uses OrbitDB to store game state and enable p2p communication and real-time updates. 

## Build

### Pre-requisites

To run the game you must have a running IDN instance (substrate node), webrtc relay server (libp2p), and the tidebound contract must be deployed. To start, open two terminals and then:

``` shell
# in terminal 1, run a local node and a relay node
docker compose up
# in terminal 2
cd contracts/tidebound
cargo contract build
./deploy_local.sh
```

Then copy the contract address into `.env` and run 

``` shell
npm i 
npm run start
```

The game opens on `localhost:3000`.

## TODOs
- [x] p2p communication w/ libp2p
    - [ ] use pubsub to relay positions [WIP]
- [ ] use ready player me for avatars (e.g. https://github.com/knightcube/react-three-fiber-practice-avatar?tab=readme-ov-file)
- [ ] add collisions to islands
- [ ] add 'play as guest' mode
- [ ] sometimes renders without color
- [ ] allow players to customize aspects of their island (through the contract, e.g. set color of things)
- [ ] improve player movements + add gravity
- [ ] connect/extend hex islands
- [ ] split home component into multiple components & add lazy loading
- [ ] implement 'factory' contract to enable multiple instances of the game
- [ ] develop axial hex grid to track world in contract storage
- [ ] R&D Tidal Energy (points)
- [ ] investigate persistance of in-game items/resources
- [ ] add audio effects (i.e. atmospheric sounds)

## License

MIT-0
