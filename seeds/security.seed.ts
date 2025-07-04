import { DataSource } from 'typeorm';
import { SecurityDetail } from '../assets/security-detail.entity';

export const seedSecurityDetails = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(SecurityDetail);

  const testData: Partial<SecurityDetail>[] = [
    {
      security_name: 'Bluechip Growth Fund',
      value: 10000,
    },
    {
      security_name: 'Global Index Fund',
      value: 15000,
    },
    {
      security_name: 'Sovereign Gold Bond',
      value: 8000,
    },
  ];

  for (const data of testData) {
    const exists = await repo.findOne({
      where: { security_name: data.security_name },
    });
    if (!exists) {
      const entity = repo.create(data);
      await repo.save(entity);
    }
  }

  console.log('✅ Seeded SecurityDetail test data');
};
