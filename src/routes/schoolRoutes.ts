import express from 'express';
import { addSchool, listSchools } from '../controllers/schoolController';
import { validateSchoolData, validateLocationParams } from '../middlewares/validationMiddleware';

const router = express.Router();

// Add a new school
router.post('/addSchool', validateSchoolData, addSchool);

// List schools 
router.get('/listSchools', validateLocationParams, listSchools);

export default router; 