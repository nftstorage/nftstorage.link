-- Authenticator login
GRANT web_anon TO authenticator;
-- nftstorage.link user
GRANT nft_link TO authenticator;
GRANT USAGE ON SCHEMA public TO nft_link;
-- allow access to all tables/sequences/functions in the public schema currently
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO nft_link;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO nft_link;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO nft_link;
-- allow access to new tables/sequences/functions that are created in the public schema in the future
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO nft_link;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO nft_link;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO nft_link;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO nft_link;
-- RO for nftstorage schema
GRANT USAGE ON SCHEMA nftstorage TO nft_link;
GRANT SELECT ON ALL TABLES IN SCHEMA nftstorage TO nft_link;
ALTER DEFAULT PRIVILEGES IN SCHEMA nftstorage GRANT SELECT ON TABLES TO nft_link;
