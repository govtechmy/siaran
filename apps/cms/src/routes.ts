import { Router } from 'express';
import { getPressReleases, getPressReleasesByAgency, createPressRelease } from './controllers/api/PressReleases';

const router = Router();

router.get('/press-releases', getPressReleases);
router.post('/press-release/create', createPressRelease);
router.get('/press-releases/by-agency', getPressReleasesByAgency);

export default router;
