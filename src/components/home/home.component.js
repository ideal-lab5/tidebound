import React, { useState, useEffect } from 'react';
import './home.component.css';
import Modal from 'react-modal';

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

    useEffect(() => {
        // Mock data for demonstration
        const mockPlayerIsland = null;//{ name: "My Island", seed: ["Asset1", "Asset2"] };
        const mockOtherIslands = [
            { id: 1, name: "Island One" },
            { id: 2, name: "Island Two" },
            { id: 3, name: "Island Three" },
        ];

        setPlayerIsland(mockPlayerIsland);
        setOtherIslands(mockOtherIslands);
    }, []);

    const handleCreateIsland = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setShowLoading(true);
        // mock
        setTimeout(() => {
            setShowLoading(false);
            setPlayerIsland({name: "my island", seed: ["0x0adfjkadfj38d8af894..."]});

        }, 5000);
    }

    return (
        <div className="container">
            <h1 className="title">Island Management</h1>
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
                                <button className="button" onClick={handleCreateIsland}>Create Island</button>
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
