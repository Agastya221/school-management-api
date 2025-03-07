import { prisma } from '../src/index';
import fs from 'fs';
import path from 'path';

// Read school data from JSON file
const schoolsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8')
);

// Seed database with sample data
export const seedDatabase = async (): Promise<void> => {
  try {
    await prisma.school.createMany({
      data: schoolsData,
      skipDuplicates: true,
    });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Execute the seeding process
(async () => {
  await seedDatabase();
  process.exit(0);
})();
