-- CreateTable
CREATE TABLE "CsvData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "favoriteSport" TEXT NOT NULL,

    CONSTRAINT "CsvData_pkey" PRIMARY KEY ("id")
);
