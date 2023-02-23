import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationChangeCommentPost1674246553653 implements MigrationInterface {
    name = 'migrationChangeCommentPost1674246553653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "likes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "likes" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "isLike" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "isLike" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "isLikes"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "isLikes"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "likes" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "likes" bigint NOT NULL DEFAULT '0'`);
    }

}
