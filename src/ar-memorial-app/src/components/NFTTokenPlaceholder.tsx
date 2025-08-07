import React from 'react';
import QRCode from 'qrcode.react';

interface NFTTokenPlaceholderProps {
    tokenId: string;
    metadataUrl: string;
}

const NFTTokenPlaceholder: React.FC<NFTTokenPlaceholderProps> = ({ tokenId, metadataUrl }) => {
    return (
        <div className="flex flex-col items-center p-4 border rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">NFT Token ID: {tokenId}</h2>
            <QRCode value={metadataUrl} size={128} />
            <p className="mt-2 text-center">Scan the QR code to view metadata</p>
        </div>
    );
};

export default NFTTokenPlaceholder;