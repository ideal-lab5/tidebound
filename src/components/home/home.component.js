import React, { useState, useEffect, useContext } from 'react';
import './home.component.css';
import Modal from 'react-modal';
import { createIsland, queryIslandRegistry } from '../../services/contract.service';
import { hexToU8a, hexToString, u8aToString } from '@polkadot/util';
import { EtfContext } from '../../EtfContext';
import appState from '../../state/appState';
import SHA3 from 'sha3';
import seedrandom from 'seedrandom';

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

    // function to update the app state for game generation
    const setGenerationSeed = appState((s) => s.setSeed);
    const setGeneral = appState((s) => s.setGeneral);

    const { etf, signer, contract, balance } = useContext(EtfContext);

    useEffect(() => {
        // Mock data for demonstration
        const mockPlayerIsland = null;//{ name: "My Island", seed: ["Asset1", "Asset2"] };
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
        // we need to go from 48 bytes to 32
        hash.update(seed);
        let out = hash.digest();
        let csprng = seedrandom(out);
        return csprng;
     }
  
    //  const randomFromSeed = (seed) => {
    //     const hash = new SHA3(512);
    //     // we need to go from 48 bytes to 32
    //     hash.update(seed);
    //     let out = hash.digest();
    //     let csprng = seedrandom(out);
    //     let rand = csprng().toString();
    //     return rand;
    //  }

    const queryIsland = async () => {
        let islandData = await queryIslandRegistry(etf, signer, contract, signer.address);
        // Assuming islandData is in the form { Ok: { flags: [], data: "0x..." } }
        const rawIslandData = islandData.Ok.data;
        console.log(islandData)
        // Convert the raw data into a u8a (if it's in hex form)
        const islandU8a = etf.createType('Bytes', rawIslandData).toU8a();
        let islandName = u8aToString(islandU8a.slice(4, 35));
        let islandSeed = islandU8a.slice(36);
        let island = { name: islandName, seed: islandSeed };
        console.log(island)
        setPlayerIsland(island)
        
        let rng = csprngFromSeed(u8aToString(island.seed));
        setGenerationSeed(rng());
        setGeneral('Trees', rng());
        setGeneral('Grass', rng());
        setGeneral('Water', rng());
        setGeneral('Clouds', rng());

        // console.log('set generation seed');
        // console.log(rng())

    }

    const handleCreateIslandModal = async () => {
        setShowModal(true);
    }

    const handleCloseModal = async () => {
        setShowModal(false)
        setShowLoading(true);

        try {
            let name = 'my island is so hot right now!!!';
            await createIsland(etf, signer, name, contract, async (result) => {
                if (result.status.isInBlock) {
                    await queryIsland();
                }
            });
            setShowLoading(false);
        } catch (e) {
            console.log(e);
            setShowLoading(false);
        }

        // mock
        // setTimeout(() => {
        //     setShowLoading(false);
        //     setPlayerIsland({name: "my island", seed: ["0x0adfjkadfj38d8af894..."]});

        // }, 5000);
    }

    return (
        <div className="container">
            <h1 className="title">Island Management</h1>
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
                }

                <div className="other-islands-section">
                    <h2>Other Players' Islands</h2>
                    <ul className="island-list">
                        {otherIslands.map((island) => (
                            <li key={island.id} className="island-item">
                                {island.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
