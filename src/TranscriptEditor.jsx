import React, { useState, useEffect } from 'react';

const TranscriptEditor = ({ initialTranscript }) => {
    const [transcript, setTranscript] = useState(initialTranscript);
    const [currentWordIndex, setCurrentWordIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const [editedWord, setEditedWord] = useState('');
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        let timeoutId;

        if (currentWordIndex !== null && currentWordIndex < transcript.length && isEditing === null) {
            const currentWord = transcript[currentWordIndex];
            setCurrentTime(currentWord.start_time); // Update the current time
            timeoutId = setTimeout(() => {
                setCurrentWordIndex((prevIndex) => prevIndex + 1);
            }, currentWord.duration);
        }

        return () => clearTimeout(timeoutId);
    }, [currentWordIndex, transcript, isEditing]);

    const handlePlay = () => {
        if (isEditing === null) {
            setCurrentWordIndex(0);
            setCurrentTime(0);
        }
    };

    const handleWordClick = (index, word) => {
        setIsEditing(index);
        setEditedWord(word);
    };

    const handleWordChange = (e) => {
        setEditedWord(e.target.value);
    };

    const handleWordSave = (index) => {
        const updatedTranscript = transcript.map((word, i) =>
            i === index ? { ...word, word: editedWord } : word
        );
        setTranscript(updatedTranscript);
        setIsEditing(null);
    };

    return (
        <div className="transcript-editor p-4 bg-gray-900 text-white rounded-lg max-w-xl mx-auto shadow-md">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 transition duration-150"
                onClick={handlePlay}
                disabled={isEditing !== null}
            >
                Play
            </button>
            <div className="transcript space-y-2">
                <div className="text-gray-400 text-sm mb-2">
                    {/* Display current playback time */}
                    {`00:${(currentTime / 1000).toFixed(1)}`}
                </div>
                <p className="text-justify">
                    {transcript.map((item, index) => (
                        <span
                            key={index}
                            className={`word ${index === currentWordIndex ? 'bg-yellow-500 text-black' : ''} px-1 cursor-pointer border-b-2 border-transparent hover:border-yellow-500 transition duration-150 ease-in-out`}
                            onClick={() => handleWordClick(index, item.word)}
                        >
                            {isEditing === index ? (
                                <input
                                    value={editedWord}
                                    onChange={handleWordChange}
                                    onBlur={() => handleWordSave(index)}
                                    className="bg-transparent border-none focus:outline-none focus:border-yellow-500"
                                    autoFocus
                                />
                            ) : (
                                item.word
                            )}{' '}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
};

export default TranscriptEditor;
