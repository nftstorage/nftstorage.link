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

-- Perma cache transaction type.
CREATE TYPE perma_cache_event_type AS ENUM (
    -- A PUT event on perma cache.
    'Put',
    -- A DELETE event on perma cache.
    'Delete'
    );

-- A nftstorage.link perma cache entry.
CREATE TABLE IF NOT EXISTS public.perma_cache
(
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT                                                        NOT NULL,
    source_url     TEXT                                                          NOT NULL,
    normalized_url TEXT                                                          NOT NULL,
    size           BIGINT                                                        NOT NULL,
    inserted_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, normalized_url)
);

CREATE INDEX IF NOT EXISTS perma_cache_user_id_idx ON perma_cache (user_id);

-- A nftstorage.link perma cache event.
CREATE TABLE IF NOT EXISTS public.perma_cache_event
(
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT                                                        NOT NULL,
    normalized_url TEXT                                                          NOT NULL,
    data           JSONB                                                         NOT NULL,
    inserted_at    TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type           perma_cache_event_type                                                   NOT NULL
);

CREATE INDEX IF NOT EXISTS perma_cache_event_user_id_idx ON perma_cache_event (user_id);
