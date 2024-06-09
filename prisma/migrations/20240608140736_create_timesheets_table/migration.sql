-- CreateTable
CREATE TABLE "timesheets" (
    "id" TEXT NOT NULL,
    "user_id" VARCHAR(100) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "start_time" VARCHAR(10) NOT NULL,
    "end_time" VARCHAR(10) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "project_id" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(100) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
