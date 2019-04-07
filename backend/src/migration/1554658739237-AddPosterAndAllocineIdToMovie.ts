import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPosterAndAllocineIdToMovie1554658739237 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "allocineId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "UQ_f5ce596bbddb750c3918747f35e" UNIQUE ("allocineId")`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "poster" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "poster"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "UQ_f5ce596bbddb750c3918747f35e"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "allocineId"`);
    }

}
