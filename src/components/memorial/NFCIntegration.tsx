import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Nfc, Smartphone, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface NFCIntegrationProps {
  memorialId: string;
  memorialUrl: string;
  onClose?: () => void;
}

export const NFCIntegration: React.FC<NFCIntegrationProps> = ({ 
  memorialId, 
  memorialUrl, 
  onClose 
}) => {
  const [isWriting, setIsWriting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [nfcData, setNfcData] = useState<string>('');
  const [customUrl, setCustomUrl] = useState(memorialUrl);
  const [writeSuccess, setWriteSuccess] = useState(false);

  // Check if NFC is supported
  const isNFCSupported = 'NDEFWriter' in window || 'NDEFReader' in window;

  const writeToNFC = async () => {
    if (!isNFCSupported) {
      toast.error('NFC is not supported on this device');
      return;
    }

    try {
      setIsWriting(true);
      
      // @ts-ignore - NDEFWriter may not be in TypeScript types yet
      const writer = new NDEFWriter();
      
      await writer.write({
        records: [
          {
            recordType: 'url',
            data: customUrl
          },
          {
            recordType: 'text',
            data: `Memorial for Memorial ID: ${memorialId}`
          }
        ]
      });
      
      setWriteSuccess(true);
      toast.success('NFC tag written successfully!');
    } catch (error: any) {
      console.error('NFC write error:', error);
      toast.error(`Failed to write NFC tag: ${error.message}`);
    } finally {
      setIsWriting(false);
    }
  };

  const readNFC = async () => {
    if (!isNFCSupported) {
      toast.error('NFC is not supported on this device');
      return;
    }

    try {
      setIsReading(true);
      
      // @ts-ignore - NDEFReader may not be in TypeScript types yet
      const reader = new NDEFReader();
      
      await reader.scan();
      
      reader.onreading = (event: any) => {
        const records = event.message.records;
        let data = '';
        
        for (const record of records) {
          if (record.recordType === 'url') {
            data += `URL: ${record.data}\n`;
          } else if (record.recordType === 'text') {
            data += `Text: ${new TextDecoder().decode(record.data)}\n`;
          }
        }
        
        setNfcData(data);
        setIsReading(false);
        toast.success('NFC tag read successfully!');
      };
      
      reader.onerror = (error: any) => {
        console.error('NFC read error:', error);
        toast.error('Failed to read NFC tag');
        setIsReading(false);
      };
      
    } catch (error: any) {
      console.error('NFC scan error:', error);
      toast.error(`Failed to start NFC scan: ${error.message}`);
      setIsReading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast.success('URL copied to clipboard!');
  };

  const generateNFCInstructions = () => {
    const instructions = [
      "1. Use NFC Tools app on Android or NFC TagInfo on iOS",
      "2. Write URL record with the memorial link",
      "3. Optionally add text record with memorial info",
      "4. Test the tag by scanning with your phone",
      "5. Place the NFC tag on/near the physical memorial"
    ];
    
    return instructions;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <Nfc className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">NFC Integration</h2>
          {isNFCSupported ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Supported
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Supported
            </Badge>
          )}
        </div>

        {/* URL Configuration */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="memorial-url">Memorial URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="memorial-url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This URL will be written to the NFC tag
            </p>
          </div>
        </div>

        {/* NFC Actions */}
        {isNFCSupported ? (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="p-4 border-primary/10">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Nfc className="w-4 h-4" />
                Write to NFC Tag
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Write the memorial URL to an NFC tag. Hold the tag near your device when prompted.
              </p>
              <Button
                onClick={writeToNFC}
                disabled={isWriting}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isWriting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Writing...
                  </>
                ) : writeSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Write Complete
                  </>
                ) : (
                  'Write NFC Tag'
                )}
              </Button>
            </Card>

            <Card className="p-4 border-primary/10">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Read NFC Tag
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Test an existing NFC tag by reading its content.
              </p>
              <Button
                variant="outline"
                onClick={readNFC}
                disabled={isReading}
                className="w-full border-primary"
              >
                {isReading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    Scanning...
                  </>
                ) : (
                  'Read NFC Tag'
                )}
              </Button>
            </Card>
          </div>
        ) : (
          <Card className="p-4 bg-muted/50 mb-6">
            <h3 className="font-semibold text-muted-foreground mb-2">Manual NFC Setup</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your device doesn't support Web NFC. Use these manual instructions:
            </p>
            <div className="space-y-2">
              {generateNFCInstructions().map((instruction, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {instruction}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* NFC Data Display */}
        {nfcData && (
          <Card className="p-4 bg-green-50 border-green-200 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">NFC Tag Data</h3>
            <pre className="text-xs text-green-700 whitespace-pre-wrap">{nfcData}</pre>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-primary mb-3">How to Use NFC Memorial Tags</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>Physical Memorial:</strong> Attach the NFC tag to headstone, plaque, or memorial display</p>
            <p>• <strong>Visitor Experience:</strong> Visitors tap their phone to the tag to access the digital memorial</p>
            <p>• <strong>Security:</strong> NFC tags can be locked to prevent overwriting</p>
            <p>• <strong>Durability:</strong> Use weather-resistant NFC tags for outdoor memorials</p>
            <p>• <strong>Backup:</strong> Always keep the memorial URL accessible via QR code as well</p>
          </div>
        </Card>

        {/* Close Button */}
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