import { AppDaappppataSource } from '../../data-source'; // root-level file
import { seedSecurityDetails } from './security.seed';

async function runSeeder() {
  await AppDataSource.initialize();
  console.log('Connected to DB ✅');

  await seedSecurityDetails(AppDataSource);

  await AppDataSource.destroy();
  console.log('Seeder finished ✅');
}

runSeeder().catch((e) => {
  console.error('❌ Seeder failed:', e);
  process.exit(1);
});
