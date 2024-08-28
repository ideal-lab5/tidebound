import React, { useState, useEffect, useContext, useCallback } from 'react';
import './home.component.css';
import Modal from 'react-modal';
import { createIsland, queryIslandRegistry } from '../../services/contract.service';
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
    const [playerIsland, setPlayerIsland] = useState(null);
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
        const mockOtherIslands = [
            { seed: "1", name: "Island One" },
            { seed: "2", name: "Island Two" },
            { seed: "3", name: "Island Three" },
        ];

        if (signer) {
            queryIsland().then(() => {
                setOtherIslands(mockOtherIslands);
            });
        }
    }, [signer]);

    const csprngFromSeed = (seed) => {
        const hash = new SHA3(512);
        hash.update(seed);
        let out = hash.digest();
        let csprng = seedrandom(out);
        return csprng;
    }

    const queryIsland = async () => {
        try {
            let islandData = await queryIslandRegistry(etf, signer, contract, signer.address);
            console.log("Here we go buddy");
            console.log(islandData);
            // Assuming islandData is in the form { Ok: { flags: [], data: "0x..." } }
            const rawIslandData = islandData.Ok.data;
            // Convert the raw data into a u8a (if it's in hex form)
            const islandU8a = etf.createType('Bytes', rawIslandData).toU8a();
        
            let islandName = u8aToString(islandU8a.slice(4, 35));
            let islandSeed = islandU8a.slice(36);
        
            if (islandName != "") {
            
                let island = { name: islandName, seed: islandSeed };
            
                setPlayerIsland(island)
            
                let rng = csprngFromSeed(u8aToString(island.seed));
                setGenerationSeed(rng());
                setGeneral('Trees', rng());
                setGeneral('Grass', rng());
                setGeneral('Water', rng());
                setGeneral('Clouds', rng());
            }
        } catch (err) {
            console.log("Error getting Island Registry");
            console.log(err);

        }
       
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
                    await queryIsland();
                }
            });
            setShowLoading(false);
        } catch (e) {
            console.log(e);
            setShowLoading(false);
        }
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
                        {playerIsland ? (
                            <div className='world-info-container'>
                                <h2>Your Island</h2>
                                <p><strong>Name:</strong> {playerIsland.name}</p>
                                <p><strong>Seed:</strong> {playerIsland.seed}</p>
                                <button className='smash-button' onClick={props.onEnterGame}>Enter</button>
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
                                > <div> HEY WE LOADING IN HERE </div></Modal>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'worldmap' && (
                    <div className='worldmap-details'>
                        <h2>WorldMap</h2>
                        <span>Coming Soon</span>
                        <HexMap />
                        {/* Content related to the WorldMap goes here */}
                    </div>
                )}
            </main>
        </div>

    );
}

export default Home;

// <div className="container">
{/* <h1 className="title">Island Management</h1>
            <div className='player-details island-section'>
                <span>AccountId: {signer ? signer.address : ''}</span>
                <span>Balance: {balance}</span>
            </div>
            <div className="content">
                {showLoading ? <div className='island-section'>
                    Loading...
                </div> :
                    <div>
                        {playerIsland ? (
                            <div className="island-section">
                                <h2>Your Island</h2>
                                <p><strong>Name:</strong> {playerIsland.name}</p>
                                <p><strong>Seed:</strong> {playerIsland.seed}</p>
                                <button className='button' onClick={props.onEnterGame}>Enter</button>
                            </div>
                        ) : (
                            <div className="island-section">
                                <h2>Create Your Island</h2>
                                <button className="button" onClick={handleCreateIslandModal}>Create Island</button>
                                <Modal
                                    isOpen={showModal}
                                    onRequestClose={handleCloseModal}
                                    contentLabel='Create an Island'
                                    style={customStyles}
                                >
                                    <div className='create-island'>
                                        <label htmlFor='name'>Name: </label>
                                        <input id="name" type="text" placeholder='Isla Palma' />
                                        <label htmlFor='seed'>Seed: </label>
                                        <input id="seed" type="text" placeholder='(Optional) seed your island' />
                                        <button className='button' onClick={handleCloseModal}>Create</button>
                                    </div>
                                </Modal>
                            </div>
                        )}
                    </div>
                } */}

{/* <div className="other-islands-section">
                    <h2>Other Players' Islands</h2>
                    <ul className="island-list">
                        {otherIslands.map((island) => (
                            <li key={island.id} className="island-item">
                                {island.name}
                            </li>
                        ))}
                    </ul>
                </div> */}
//     </div>
// </div >