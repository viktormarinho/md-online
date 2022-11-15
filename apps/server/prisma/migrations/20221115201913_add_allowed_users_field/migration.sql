-- CreateTable
CREATE TABLE "_allowed_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_allowed_users_A_fkey" FOREIGN KEY ("A") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_allowed_users_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_allowed_users_AB_unique" ON "_allowed_users"("A", "B");

-- CreateIndex
CREATE INDEX "_allowed_users_B_index" ON "_allowed_users"("B");
