CREATE SCHEMA IF NOT EXISTS nftstorage;

-- Import nftstorage schema
IMPORT FOREIGN SCHEMA public
    LIMIT TO (public.user, auth_key, user_tag)
    FROM SERVER nftstorage_server
    INTO nftstorage;
