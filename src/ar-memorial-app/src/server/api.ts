import express from 'express';
import { json } from 'body-parser';
import { handleNFC, handleNFT, handleGPS } from './controllers';

const router = express.Router();

router.use(json());

router.post('/nfc', handleNFC);
router.post('/nft', handleNFT);
router.get('/gps', handleGPS);

export default router;