-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "repository_url" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_skills" (
    "project_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,

    CONSTRAINT "project_skills_pkey" PRIMARY KEY ("project_id","skill_id")
);

-- CreateIndex
CREATE INDEX "projects_profile_id_position_idx" ON "projects"("profile_id", "position");

-- CreateIndex
CREATE INDEX "project_skills_skill_id_idx" ON "project_skills"("skill_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
