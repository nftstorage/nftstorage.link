CREATE SCHEMA IF NOT EXISTS nftstorage;

-- This is a partial copy of the nftstorage schema for testing purposes.
-- https://github.com/nftstorage/nft.storage/blob/main/packages/api/db/tables.sql

-- A user of NFT.Storage
CREATE TABLE IF NOT EXISTS nftstorage.user
(
    id             BIGSERIAL PRIMARY KEY,
    magic_link_id  TEXT UNIQUE,
    github_id      TEXT                                                          NOT NULL UNIQUE,
    name           TEXT                                                          NOT NULL,
    picture        TEXT,
    email          TEXT                                                          NOT NULL,
    -- Cryptographic public address of the user.
    public_address TEXT UNIQUE,
    did            TEXT UNIQUE,
    github         jsonb,
    inserted_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS user_updated_at_idx ON nftstorage.user (updated_at);

CREATE TABLE IF NOT EXISTS nftstorage.user_tag
(
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT                                                        NOT NULL REFERENCES nftstorage.user (id),
  tag             user_tag_type                                                 NOT NULL,
  value           TEXT                                                          NOT NULL,
  reason          TEXT                                                          NOT NULL,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())     NOT NULL,
  deleted_at  TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX IF NOT EXISTS user_tag_is_deleted_idx ON nftstorage.user_tag (user_id, tag, deleted_at)
WHERE deleted_at IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS user_tag_is_not_deleted_idx ON nftstorage.user_tag (user_id, tag)
WHERE deleted_at IS NULL;

-- API authentication tokens.
CREATE TABLE IF NOT EXISTS nftstorage.auth_key
(
    id          BIGSERIAL PRIMARY KEY,
    -- User assigned name.
    name        TEXT                                                          NOT NULL,
    -- The JWT used by the user to access the API.
    secret      TEXT                                                          NOT NULL,
    user_id     BIGINT                                                        NOT NULL REFERENCES nftstorage.user (id),
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Test data for tables
INSERT INTO nftstorage."user" (magic_link_id, github_id, name, email, public_address) VALUES ('did:ethr:0x65007A739ab7AC5c537161249b81250E49e2853C', 'github|000000', 'mock user', 'test@gmail.com', '0x65007A739ab7AC5c537161249b81250E49e2853C');
INSERT INTO nftstorage.auth_key (name, secret, user_id) VALUES ('main', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY1MDA3QTczOWFiN0FDNWM1MzcxNjEyNDliODEyNTBFNDllMjg1M0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzOTc1NDczNjYzOCwibmFtZSI6Im1haW4ifQ.wKwJIRXXHsgwVp8mOQp6r3_F4Lz5lnoAkgVP8wqwA_Y', 1);