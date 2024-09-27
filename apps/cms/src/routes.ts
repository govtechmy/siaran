import { Router } from 'express';
import { getPressReleases, getPressReleasesByAgency,  } from './controllers/api/PressReleases';
import { Search } from './controllers/api/Search';

const router = Router();

router.get('/press-releases', getPressReleases);
// router.post('/press-release/create', createPressRelease);
router.get('/press-releases/by-agency', getPressReleasesByAgency);
router.get('/find', Search);

export default router;
