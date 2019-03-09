import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1552171398051 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "screening" ("date" TIMESTAMP WITH TIME ZONE NOT NULL, "movieId" integer NOT NULL, CONSTRAINT "PK_ba38908b54f8a88162af91985e8" PRIMARY KEY ("date", "movieId"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" integer NOT NULL, "title" character varying NOT NULL, "runtime" integer NOT NULL, "plot" character varying NOT NULL, "actors" character varying array NOT NULL DEFAULT '{}', "directors" character varying array NOT NULL DEFAULT '{}', "pressRatings" double precision, "userRatings" double precision, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriber" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_073600148a22d05dcf81d119a6a" UNIQUE ("email"), CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_a84042bef1152d9dbdb1446c811" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_a84042bef1152d9dbdb1446c811"`);
        await queryRunner.query(`DROP TABLE "subscriber"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "screening"`);
    }

}
