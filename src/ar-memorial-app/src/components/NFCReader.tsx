import React, { useEffect, useState } from 'react';

const NFCReader: React.FC = () => {
    const [nfcData, setNfcData] = useState<string | null>(null);

    useEffect(() => {
        const nfcReader = async () => {
            if ('NFC' in navigator) {
                try {
                    const nfc = navigator.nfc;
                    const reader = new NDEFReader();
                    await reader.scan();
                    reader.onreading = (event) => {
                        const message = event.message;
                        const records = message.records;
                        if (records.length > 0) {
                            setNfcData(records[0].data);
                        }
                    };
                } catch (error) {
                    console.error('Error reading NFC:', error);
                }
            } else {
                console.error('NFC is not supported on this device.');
            }
        };

        nfcReader();
    }, []);

    return (
        <div className="nfc-reader">
            <h2>NFC Reader</h2>
            {nfcData ? (
                <div>
                    <p>NFC Data: {nfcData}</p>
                </div>
            ) : (
                <p>Scan an NFC tag to see the data.</p>
            )}
        </div>
    );
};

export default NFCReader;