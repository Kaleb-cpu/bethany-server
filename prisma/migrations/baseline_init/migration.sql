-- CreateTable
CREATE TABLE "artists" (
    "artist_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255),
    "bio" TEXT,
    "country" VARCHAR(100),
    "profile_image_url" TEXT,
    "auth_provider" VARCHAR(50) DEFAULT 'local',
    "provider_id" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("artist_id")
);

-- CreateTable
CREATE TABLE "artist_sessions" (
    "session_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "artist_id" INTEGER,
    "refresh_token" VARCHAR(255),
    "expires_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artists_email_key" ON "artists"("email");

-- AddForeignKey
ALTER TABLE "artist_sessions" ADD CONSTRAINT "artist_sessions_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("artist_id") ON DELETE CASCADE ON UPDATE NO ACTION;

