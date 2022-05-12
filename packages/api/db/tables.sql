-- User tags are associated to a user for the purpose of granting/restricting them
-- in the application.
-- Needed per https://www.postgresql.org/message-id/20141203213139.GA9855%40fetter.org
CREATE TYPE user_tag_type AS ENUM
(
  'HasAccountRestriction',
  'HasPsaAccess',
  'HasSuperHotAccess',
  'StorageLimitBytes'
);

-- A transaction in nftstorage.link perma cache.
CREATE TABLE IF NOT EXISTS public.perma_cache
(
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT                                                          NOT NULL,
    url            TEXT                                                          NOT NULL,
    size           BIGINT                                                         NOT NULL,
    inserted_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at     TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS perma_cache_user_id_idx ON perma_cache (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS perma_cache_is_deleted_idx ON perma_cache (user_id, url, deleted_at)
WHERE deleted_at IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS perma_cache_is_not_deleted_idx ON perma_cache (user_id, url)
WHERE deleted_at IS NULL;
