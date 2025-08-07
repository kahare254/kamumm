import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, QrCode, ExternalLink } from 'lucide-react';

interface NFTTokenPlaceholderProps {
  memorialId: string;
  onClose?: () => void;
}

export const NFTTokenPlaceholder: React.FC<NFTTokenPlaceholderProps> = ({ 
  memorialId, 
  onClose 
}) => {
  // Mock generation of NFT details based on memorialId
  const generateMockNFTDetails = (id: string) => {
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockAddress = `0x${(hash * 123456789).toString(16).padStart(40, '0').substring(0, 40)}`;
    const mockTokenId = (hash * 987654321).toString().substring(0, 10);
    const mockIpfsCid = `bafybeig${(hash * 11111111111111111111).toString(36).padStart(52, '0').substring(0, 52)}`;
    return { mockAddress, mockTokenId, mockIpfsCid };
  };

  const { mockAddress, mockTokenId, mockIpfsCid } = generateMockNFTDetails(memorialId);

  const openseaLink = `https://opensea.io/assets/ethereum/${mockAddress}/${mockTokenId}`;
  const etherscanLink = `https://etherscan.io/address/${mockAddress}`;
  const ipfsGatewayLink = `https://ipfs.io/ipfs/${mockIpfsCid}`;
  const qrCodeData = `${window.location.origin}/memorial/${memorialId}/nft`; // Example link for QR

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <Gem className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">NFT Memorial Token</h2>
        </div>

        <p className="text-muted-foreground mb-4">
          This memorial can optionally be represented as a Non-Fungible Token (NFT) on a blockchain. 
          This provides a permanent, verifiable, and transferable digital record of the memorial.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-primary">NFT Contract Address:</h3>
            <p className="text-sm text-muted-foreground break-all">{mockAddress}</p>
            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => window.open(etherscanLink, '_blank')}>
              View on Etherscan <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <div>
            <h3 className="font-semibold text-primary">NFT Token ID:</h3>
            <p className="text-sm text-muted-foreground">{mockTokenId}</p>
          </div>

          <div>
            <h3 className="font-semibold text-primary">View on OpenSea:</h3>
            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => window.open(openseaLink, '_blank')}>
              View NFT on OpenSea <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <div>
            <h3 className="font-semibold text-primary">IPFS Content Link:</h3>
            <p className="text-sm text-muted-foreground break-all">{ipfsGatewayLink}</p>
            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => window.open(ipfsGatewayLink, '_blank')}>
              View Content on IPFS Gateway <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <QrCode className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-primary">QR Code for NFT Link</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Scan this QR code to directly access the NFT's details and associated memorial content.
        </p>
        <div className="flex justify-center mb-6">
          {/* Placeholder for QR Code Generator component */}
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
            <p className="text-muted-foreground text-sm">QR Code Here</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• NFTs provide verifiable ownership and provenance for digital memorials.</p>
          <p>• Content stored on IPFS ensures decentralized and permanent accessibility.</p>
          <p>• This feature is optional and can be enabled for specific memorials.</p>
        </div>

        {onClose && (
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
