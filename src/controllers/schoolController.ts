import { Request, Response } from 'express';
import { prisma } from '../index';
import { redis } from '../index';
import path from 'path';
import fs from 'fs';


interface RequestWithCoordinates extends Request {
  parsedCoordinates?: {
    latitude: number;
    longitude: number;
  };
}


interface School {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}


interface SchoolWithDistance extends School {
  distance: number;
}



// Read school data from JSON file
const schoolsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../prisma/data.json'), 'utf-8')
);



// Add new school
export const addSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || !latitude || !longitude) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    // Create new school
    const school = await prisma.school.create({
      data: {
        name,
        address,
        latitude,
        longitude,
      },
    });

    // Clear cache for school-list
    await redis.del('schools');

    res.status(201).json({
      success: true,
      data: school,
      message: 'School added successfully',
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// List schools sorted by proximity to user's location
export const listSchools = async (req: RequestWithCoordinates, res: Response): Promise<void> => {
  try {
    const userLat = parseFloat(req.query.latitude as string);
    const userLon = parseFloat(req.query.longitude as string);

    console.log('userLat:', userLat);
    console.log('userLon:', userLon);

    if (isNaN(userLat) || isNaN(userLon)) {
      res.status(400).json({
        success: false,
        message: 'Coordinates not provided or invalid',
      });
      return;
    }

      

    // Check cache first
    const cachedSchools = await redis.get('schools');
    if (cachedSchools) {
      res.status(200).json({
        success: true,
        data: JSON.parse(cachedSchools),
        message: 'Schools retrieved successfully (from cache)',
      });
      return;
    }

    // Fetch and sort schools 
    const schools = await prisma.$queryRaw<SchoolWithDistance[]>`
      SELECT *,
        (6371 * ACOS(
          COS(RADIANS(${userLat})) * COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(${userLon})) +
          SIN(RADIANS(${userLat})) * SIN(RADIANS(latitude))
        )) AS distance
      FROM "School" s
      WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL
      ORDER BY distance ASC;
    `;

    // Caching the results
    await redis.set('schools', JSON.stringify(schools), 'EX', 3600); 

    res.status(200).json({
      success: true,
      data: schools,
      message: 'Schools retrieved successfully',
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
