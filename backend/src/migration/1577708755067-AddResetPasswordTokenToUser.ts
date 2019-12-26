import {MigrationInterface, QueryRunner} from "typeorm";

export class AddResetPasswordTokenToUser1577708755067 implements MigrationInterface {
    name = 'AddResetPasswordTokenToUser1577708755067'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPasswordToken" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6699b8457beeaf928125b348e81" UNIQUE ("resetPasswordToken")`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6699b8457beeaf928125b348e81"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPasswordToken"`, undefined);
    }

}
