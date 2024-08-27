# Tidebound

Tidebound is a **fully decentralized**, peer-to-peer web3 game. It is an 'autonomous world' set in a flooded apocalypse where layers are subject to the random wills of the tides. They must overcome to recover the world. 

Tidebound is powered by verifiable randomness from the IDN Randomness beacon. It uses OrbitDB to store game state and enable p2p communication and real-time updates. 

## Build

### Pre-requisites

To run the game you must have a running IDN instance (node) and the tidebound contract must be deployed.

``` shell
docker pull ideallabs/etf
docker run ideallabs/etf --tmp --dev --alice
cd contracts/tidebound
./deploy_local.sh
```

Then copy the contract address into index.js and run 

``` shell
npm i 
npm run start
```

## TODOs
- [ ] p2p communication via orbitdb
- [ ] implement 'factory' contract to enable multiple instances of the game
- [ ] develop axial hex grid to track world in contract storage
- [ ] R&D Tidal Energy (points)
- [ ] investigate persistance of in-game items/resources

## License

Apache2
