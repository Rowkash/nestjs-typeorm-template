import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPortfolioImageStatus1769014511711 implements MigrationInterface {
  name = 'AddPortfolioImageStatus1769014511711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "images" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ALTER COLUMN "url" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "images" ALTER COLUMN "url" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "images" DROP COLUMN "status"`);
  }
}
