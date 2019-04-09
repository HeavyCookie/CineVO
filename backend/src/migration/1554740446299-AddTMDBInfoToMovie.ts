import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTMDBInfoToMovie1554740446299 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "tmdbId" integer`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_e67ea82f6973f5b9a6747fba346" UNIQUE ("tmdbId")`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "release" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "backdrop" character varying`);
        await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "plot" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "poster" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "poster" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ALTER COLUMN "plot" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "backdrop"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "release"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_e67ea82f6973f5b9a6747fba346"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "tmdbId"`);
    }

}
