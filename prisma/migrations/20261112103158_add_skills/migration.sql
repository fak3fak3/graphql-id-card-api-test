-- CreateEnum
CREATE TYPE "skill_category" AS ENUM ('LANGUAGE', 'FRONTEND', 'BACKEND', 'DATABASE', 'INFRASTRUCTURE', 'TOOLS');

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "skill_category" NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skills_profile_id_position_idx" ON "skills"("profile_id", "position");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
