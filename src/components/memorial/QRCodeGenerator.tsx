import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  data: string;
  size?: number;
  className?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  size = 128, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [data, size]);

  return (
    <canvas 
      ref={canvasRef}
      className={`${className}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};