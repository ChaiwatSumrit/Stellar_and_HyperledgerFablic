#DATABASE_URL="postgresql://stellar:stellar@localhost:5432/horizon1" horizon db init

horizon --port 8000 --ingest=true  --db-url="postgresql://stellar:stellar@localhost:5432/horizon1"  --stellar-core-db-url="postgresql://stellar:stellar@localhost:5432/core1"  --stellar-core-url="http://127.0.0.1:11626" --network-passphrase="Private Network ; February 2017"


#horizon db clear --port 8000 --ingest=true  --db-url="postgresql://stellar:stellar@localhost:5432/horizon1"  --stellar-core-db-url="postgresql://stellar:stellar@localhost:5432/core1"  --stellar-core-url="http://127.0.0.1:11626" --network-passphrase="Standalone Network ; February 2017"

#horizon clear reap --port 8000 --ingest=true  --db-url="postgresql://stellar:stellar@localhost:5432/horizon1"  --stellar-core-db-url="postgresql://stellar:stellar@localhost:5432/core1"  --stellar-core-url="http://127.0.0.1:11626" --network-passphrase="Standalone Network ; February 2017"

#horizon db migrate up --port 8000 --ingest=true  --db-url="postgresql://stellar:stellar@localhost:5432/horizon1"  --stellar-core-db-url="postgresql://stellar:stellar@localhost:5432/core1"  --stellar-core-url="http://127.0.0.1:11626" --network-passphrase="Standalone Network ; February 2017"
