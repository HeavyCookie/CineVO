import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLocationOnTheaters1578142787792 implements MigrationInterface {
    name = 'AddLocationOnTheaters1578142787792'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "theater" ADD "location" jsonb`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "theater" DROP COLUMN "location"`, undefined);
    }

}
