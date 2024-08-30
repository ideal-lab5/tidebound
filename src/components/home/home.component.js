import React, { useState, useEffect, useContext, useCallback } from 'react';
import './home.component.css';
import Modal from 'react-modal';
import { createIsland, queryIslandRegistry, queryPlayers } from '../../services/contract.service';
import { hexToU8a, hexToString, u8aToString } from '@polkadot/util';
import { EtfContext } from '../../EtfContext';
import appState from '../../state/appState';
import SHA3 from 'sha3';
import seedrandom from 'seedrandom';
import HexMap from '../map/hex-map';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#001f3f', // Deep navy blue for a nautical feel
        color: '#ffcc00', // Bright yellow text for contrast
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)', // Strong shadow for depth
        fontFamily: "'Press Start 2P', cursive", // Retro game font
        textAlign: 'center', // Center text within the modal
        border: '2px solid #003366', // Border matching the nautical theme
    },
};

function Home(props) {
    const [currentIsland, setCurrentIsland] = useState(null);
    const [otherIslands, setOtherIslands] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const [name, setName] = useState('');

    const [activeTab, setActiveTab] = useState('your-island');

    // function to update the app state for game generation
    const setGenerationSeed = appState((s) => s.setSeed);
    const setGeneral = appState((s) => s.setGeneral);

    const { etf, signer, contract, balance } = useContext(EtfContext);

    useEffect(() => {

        if (signer) {
            queryIsland(signer.address).then(island => {
                if (island.seed != "") {
                    setCurrentIsland(island);
                }
                queryPlayersJs();
                // setOtherIslands(mockOtherIslands);
            });
        }
    }, [signer]);

    const queryPlayersJs = async () => {
        let players = await queryPlayers(etf, signer, contract);
        const playersu8a = etf.createType('Bytes', players.Ok.data).toU8a().slice(3);
        // assert(playersU8a % 32 === 0)
        let numPlayers = playersu8a.length / 32;
        let otherIslands = []

        for (let i = 0; i < numPlayers; i++) {
            let playerAccountId = etf.createType('AccountId', playersu8a.slice(i * 32, (i + 1) * 32))
            let islandData = await queryIslandRegistry(etf, signer, contract, playerAccountId);
            const rawIslandData = islandData.Ok.data;
            const islandU8a = etf.createType('Bytes', rawIslandData).toU8a();
            let islandName = u8aToString(islandU8a.slice(4, 35));
            let islandSeed = islandU8a.slice(36);
            let island = { 'name': islandName, 'seed': islandSeed };
            otherIslands.push(island)
        }

        setOtherIslands(otherIslands);
    }

    const csprngFromSeed = (seed) => {
        const hash = new SHA3(512);
        hash.update(seed);
        let out = hash.digest();
        let csprng = seedrandom(out);
        return csprng;
    }

    const queryIsland = async (who) => {
        let islandData = await queryIslandRegistry(etf, signer, contract, who);
        // Assuming islandData is in the form { Ok: { flags: [], data: "0x..." } }
        const rawIslandData = islandData.Ok.data;
        // Convert the raw data into a u8a (if it's in hex form)
        const islandU8a = etf.createType('Bytes', rawIslandData).toU8a();

        let islandName = u8aToString(islandU8a.slice(4, 35));
        let islandSeed = islandU8a.slice(36);

        let island = { name: islandName, seed: islandSeed };
        return island;
    }

    const handleOnEnter = async (island) => {
        await handleSetIslandGeneration(island);
        props.onEnterGame()
    }

    const handleSetIslandGeneration = async (island) => {
        let rng = csprngFromSeed(u8aToString(island.seed));
        setGenerationSeed(rng());
        setGeneral('Trees', rng());
        setGeneral('Grass', rng());
        setGeneral('Water', rng());
        setGeneral('Clouds', rng());
    }

    const handleCreateIslandModal = async () => {
        setShowModal(true);
    }

    const handleCloseModal = async () => {
        setShowModal(false)
    }

    const handleCreateIsland = async () => {
        setShowModal(false)
        setShowLoading(true);

        try {
            // format name to be exactly 32 bytes
            let formattedName = name.padEnd(32, ' ');
            await createIsland(etf, signer, formattedName, contract, async (result) => {
                if (result.status.isInBlock) {
                    await queryIsland(signer.address);
                }
            });
            setShowLoading(false);
        } catch (e) {
            console.log(e);
            setShowLoading(false);
        }
    }

    const handleVisit = (island) => {
        handleOnEnter(island);
    }

    return (
        <div className='asset-management-screen'>
            <aside className='sidebar'>
                <div className='sidebar-header'>
                    <h2>Menu</h2>
                </div>
                <ul className='sidebar-tabs'>
                    <li className={`tab ${activeTab === 'your-island' ? 'active' : ''}`} onClick={() => setActiveTab('your-island')}>Your Island</li>
                    <li className={`tab ${activeTab === 'worldmap' ? 'active' : ''}`} onClick={() => setActiveTab('worldmap')}>WorldMap</li>
                </ul>
            </aside>

            <main className='content-area'>
                {activeTab === 'your-island' && (
                    <div className='island-details'>
                        {currentIsland ? (
                            <div className='world-info-container'>
                                <h2>Your Island</h2>
                                <p><strong>Name:</strong> {currentIsland.name}</p>
                                <p><strong>Seed:</strong> {currentIsland.seed}</p>
                                <button className='smash-button' onClick={() => handleOnEnter(currentIsland)}>Enter</button>
                            </div>
                        ) : (
                            <div>
                                <h2>Create Your Island</h2>
                                <button className="smash-button" onClick={handleCreateIslandModal}>Create Island</button>
                                <Modal
                                    isOpen={showModal}
                                    onRequestClose={handleCloseModal}
                                    contentLabel='Create an Island'
                                    style={customStyles}
                                >
                                    <div className='create-island'>
                                        <label htmlFor='name'>Name: </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder='Isla Palma'
                                            maxLength={32}
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                        <button className='smash-button' onClick={handleCreateIsland}>Create</button>
                                    </div>
                                </Modal>
                                <Modal isOpen={showLoading}
                                    onRequestClose={handleCloseModal}
                                    contentLabel='Loading'
                                    style={customStyles}
                                > <div>
                                        <span>
                                            Waiting for transaction authorization from the Polkadotjs extension 
                                        </span>
                                    </div></Modal>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'worldmap' && (
                    <div className='worldmap-details'>
                        <h2>WorldMap</h2>
                        <div className="other-islands-section">
                            <h2>Other Players' Islands</h2>
                            <ul className="island-list">
                                {otherIslands.map((island) => (
                                    <li key={island.seed} className="island-item">
                                        <div>
                                            {island.name}
                                            <button onClick={() => handleVisit(island)}>visit</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>

    );
}

export default Home;
