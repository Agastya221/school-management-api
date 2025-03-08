import express from 'express';
import { addSchool, listSchools,seedDatabase } from '../controllers/schoolController';
import { validateSchoolData, validateLocationParams } from '../middlewares/validationMiddleware';
 ;

const router = express.Router();

// Add a new school
router.post('/addSchool', validateSchoolData, addSchool);

// List schools 
router.get('/listSchools', validateLocationParams, listSchools);

// Seed database with sample data
router.get('/seedDatabase', seedDatabase);

export default router; 