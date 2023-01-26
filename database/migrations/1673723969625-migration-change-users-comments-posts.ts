import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationChangeUsersCommentsPosts1673723969625 implements MigrationInterface {
    name = 'migrationChangeUsersCommentsPosts1673723969625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login")`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "likes" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "likes" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "likes" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "likes" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c"`);
    }

}
