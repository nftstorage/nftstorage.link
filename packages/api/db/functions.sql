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

    insert into perma_cache (user_id, source_url, normalized_url, size)
    values ((data ->> 'user_id')::BIGINT,
            data ->> 'source_url',
            data ->> 'normalized_url',
            (data ->> 'size')::BIGINT)
    returning inserted_at into inserted_at_ts;

    insert into perma_cache_event (user_id, source_url, normalized_url, size, type, inserted_at)
    values ((data ->> 'user_id')::BIGINT,
            data ->> 'source_url',
            data ->> 'normalized_url',
            (data ->> 'size')::BIGINT,
            ('Put')::perma_cache_event_type,
            inserted_at_ts);

    return inserted_at_ts;
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
      delete from perma_cache
      where user_id = (data ->> 'user_id')::BIGINT AND normalized_url = data ->> 'normalized_url'
      returning source_url, size
    )
    insert into perma_cache_event (user_id, source_url, normalized_url, size, type)
    select (data ->> 'user_id')::BIGINT,
            deleted.source_url,
            data ->> 'normalized_url',
            deleted.size,
            ('Delete')::perma_cache_event_type
    from deleted
    returning inserted_at into deleted_at_ts;

    return deleted_at_ts;
END
$$;

CREATE OR REPLACE FUNCTION user_used_perma_cache_storage(query_user_id BIGINT) RETURNS TEXT
  LANGUAGE plpgsql
AS
$$
BEGIN
  return(
    select sum(size)
    from perma_cache
    where user_id = query_user_id
  )::TEXT;
END
$$;
