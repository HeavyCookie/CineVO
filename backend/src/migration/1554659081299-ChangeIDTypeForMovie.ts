import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeIDTypeForMovie1554659081299 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_a84042bef1152d9dbdb1446c811"`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "PK_ba38908b54f8a88162af91985e8"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "PK_654f8d92366977093ecfe9f73fb" PRIMARY KEY ("date")`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "movieId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "PK_654f8d92366977093ecfe9f73fb"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "PK_ba38908b54f8a88162af91985e8" PRIMARY KEY ("date", "movieId")`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_a84042bef1152d9dbdb1446c811" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_a84042bef1152d9dbdb1446c811"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "PK_ba38908b54f8a88162af91985e8"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "PK_654f8d92366977093ecfe9f73fb" PRIMARY KEY ("date")`);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "movieId"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD "movieId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "PK_654f8d92366977093ecfe9f73fb"`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "PK_ba38908b54f8a88162af91985e8" PRIMARY KEY ("date", "movieId")`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_a84042bef1152d9dbdb1446c811" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
