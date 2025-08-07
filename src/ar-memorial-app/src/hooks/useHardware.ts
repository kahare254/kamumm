import { useEffect, useState } from 'react';

const useHardware = () => {
    const [isNFCEnabled, setIsNFCEnabled] = useState(false);
    const [isGPSEnabled, setIsGPSEnabled] = useState(false);

    useEffect(() => {
        // Check for NFC availability
        if ('NDEFReader' in window) {
            setIsNFCEnabled(true);
        }

        // Check for Geolocation availability
        if ('geolocation' in navigator) {
            setIsGPSEnabled(true);
        }
    }, []);

    return { isNFCEnabled, isGPSEnabled };
};

export default useHardware;