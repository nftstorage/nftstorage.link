CREATE OR REPLACE FUNCTION create_perma_cache(data json) RETURNS TIMESTAMP
    LANGUAGE plpgsql
    volatile
    PARALLEL UNSAFE
AS
$$
DECLARE
  inserted_at_ts TIMESTAMP;
BEGIN
    SET LOCAL statement_timeout = '30s';

    INSERT INTO perma_cache (user_id, source_url, normalized_url, size)
    VALUES ((data ->> 'user_id')::BIGINT,
            data ->> 'source_url',
            data ->> 'normalized_url',
            (data ->> 'size')::BIGINT)
    returning inserted_at INTO inserted_at_ts;

    INSERT INTO perma_cache_event (user_id, normalized_url, data, type, inserted_at)
    VALUES ((data ->> 'user_id')::BIGINT,
            data ->> 'normalized_url',
            jsonb_build_object(
              'source_url', data ->> 'source_url',
              'size', (data ->> 'size')::BIGINT
            ),
            ('Put')::perma_cache_event_type,
            inserted_at_ts);

    RETURN inserted_at_ts;
END
$$;

CREATE OR REPLACE FUNCTION delete_perma_cache(data json) RETURNS TIMESTAMP
    LANGUAGE plpgsql
    volatile
    PARALLEL UNSAFE
AS
$$
DECLARE
  deleted_at_ts TIMESTAMP;
BEGIN
    SET LOCAL statement_timeout = '30s';

    WITH deleted AS (
      DELETE FROM perma_cache
      WHERE user_id = (data ->> 'user_id')::BIGINT AND normalized_url = data ->> 'normalized_url'
      returning source_url, size
    )
    INSERT INTO perma_cache_event (user_id, normalized_url, data, type)
     SELECT (data ->> 'user_id')::BIGINT,
            data ->> 'normalized_url',
            jsonb_build_object(
              'source_url', deleted.source_url,
              'size', deleted.size
            ),
            ('Delete')::perma_cache_event_type
    FROM deleted
    returning inserted_at INTO deleted_at_ts;

    RETURN deleted_at_ts;
END
$$;

CREATE OR REPLACE FUNCTION user_used_perma_cache_storage(query_user_id BIGINT) RETURNS TEXT
  LANGUAGE plpgsql
AS
$$
BEGIN
  RETURN(
    SELECT sum(size)
    FROM perma_cache
    WHERE user_id = query_user_id
  )::TEXT;
END
$$;
