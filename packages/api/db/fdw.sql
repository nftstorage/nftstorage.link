CREATE
EXTENSION IF NOT EXISTS postgres_fdw;

DROP
SERVER IF EXISTS nftstorage_server CASCADE;

CREATE
SERVER nftstorage_server
  FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS ( 
      host :'NFT_STORAGE_HOST', 
      dbname :'NFT_STORAGE_DATABASE', 
      fetch_size '200000'
      );

CREATE
USER MAPPING FOR :NFT_LINK_USER
  SERVER nftstorage_server
  OPTIONS (
      user :'NFT_STORAGE_USER', 
      password :'NFT_STORAGE_PASSWORD'
    );

CREATE
USER MAPPING FOR :NFT_LINK_STATS_USER
  SERVER nftstorage_server
  OPTIONS (
      user :'NFT_STORAGE_USER', 
      password :'NFT_STORAGE_PASSWORD'
    );
