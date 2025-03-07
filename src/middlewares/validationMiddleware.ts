import { Request, Response, NextFunction } from 'express';


interface RequestWithCoordinates extends Request {
  parsedCoordinates?: {
    latitude: number;
    longitude: number;
  };
}


export const validateSchoolData = (req: Request, res: Response, next: NextFunction): void => {
  const { name, address, latitude, longitude } = req.body;

  // Check if all required fields 
  if (!name || !address || latitude === undefined || longitude === undefined) {
    res.status(400).json({
      success: false,
      message: 'All fields are required: name, address, latitude, longitude',
    });
    return;
  }

  // Validate data types
  if (
    typeof name !== 'string' ||
    typeof address !== 'string' ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    res.status(400).json({
      success: false,
      message:
        'Invalid data types: name and address should be strings, latitude and longitude should be numbers',
    });
    return;
  }

  // Validating latitude and longitude ranges
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    res.status(400).json({
      success: false,
      message:
        'Invalid coordinates: latitude must be between -90 and 90, longitude must be between -180 and 180',
    });
    return;
  }

  next();
};

// Middleware to validate location 
export const validateLocationParams = (req: RequestWithCoordinates, res: Response, next: NextFunction): void => {
  const { latitude, longitude } = req.query;

  // Check if both parameters are present
  if (latitude === undefined || longitude === undefined) {
    res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required query parameters',
    });
    return;
  }

  // Parse and validate coordinates
  const userLat = parseFloat(latitude as string);
  const userLon = parseFloat(longitude as string);

  if (isNaN(userLat) || isNaN(userLon)) {
    res.status(400).json({
      success: false,
      message: 'Latitude and longitude must be valid numbers',
    });
    return;
  }

  if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
    res.status(400).json({
      success: false,
      message:
        'Invalid coordinates: latitude must be between -90 and 90, longitude must be between -180 and 180',
    });
    return;
  }

  // Add parsed coordinates to request for controller use
  req.parsedCoordinates = {
    latitude: userLat,
    longitude: userLon,
  };

  next();
}; 