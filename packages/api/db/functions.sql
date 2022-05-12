CREATE OR REPLACE FUNCTION user_used_perma_cache_storage(query_user_id BIGINT) RETURNS TEXT
  LANGUAGE plpgsql
AS
$$
BEGIN
  return(
    select sum(size)
    from perma_cache
    where user_id = query_user_id and deleted_at is null
  )::TEXT;
END
$$;