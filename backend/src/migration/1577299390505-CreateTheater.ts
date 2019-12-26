import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTheater1577299390505 implements MigrationInterface {
    name = 'CreateTheater1577299390505'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "theater" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allocineCode" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "street" character varying NOT NULL, "postcode" integer NOT NULL, "city" character varying NOT NULL, CONSTRAINT "UQ_83e92531a5b89b47e97a10b50a0" UNIQUE ("allocineCode"), CONSTRAINT "PK_c70874202894cfb1575a5b2b743" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" ADD "theaterId" uuid NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "PK_ba38908b54f8a88162af91985e8"`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "PK_8d120fe2f4a98bc0c848e4a0b5f" PRIMARY KEY ("date", "movieId", "theaterId")`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "FK_bda8523916fec884d0b4ddc6065" FOREIGN KEY ("theaterId") REFERENCES "theater"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "FK_bda8523916fec884d0b4ddc6065"`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" DROP CONSTRAINT "PK_8d120fe2f4a98bc0c848e4a0b5f"`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" ADD CONSTRAINT "PK_ba38908b54f8a88162af91985e8" PRIMARY KEY ("date", "movieId")`, undefined);
        await queryRunner.query(`ALTER TABLE "screening" DROP COLUMN "theaterId"`, undefined);
        await queryRunner.query(`DROP TABLE "theater"`, undefined);
    }

}
