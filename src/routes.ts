import { Router } from  'express';
import { csvLoadService } from './services/csvLoadService';
import { upload } from './multerSetup';
import { getUsersService } from './services/getUsersService';

const router = Router();

router.post('/files', upload.single('file'), csvLoadService);
router.get('/users', getUsersService);

export default router;


