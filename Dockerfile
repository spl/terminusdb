FROM terminusdb/swipl:v8.4.2 AS base
ENV TERMINUSDB_RUNTIME_DEPS git libjwt0 openssl
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ${TERMINUSDB_RUNTIME_DEPS}; \
    rm -rf /var/lib/apt/lists/*; \
    rm -rf /var/cache/apt/*

FROM ghcr.io/spl/terminusdb-builder:v1 AS pack_installer
WORKDIR /app/pack
COPY ./Makefile /app/pack
RUN set -eux; \
    export TMP_DIR=$(mktemp --directory); \
    make install-deps; \
    make install-jwt

FROM ghcr.io/spl/terminusdb-builder:v1 AS rust_builder
WORKDIR /app/rust
COPY ./Makefile /app/rust
COPY ./src/rust /app/rust
ARG MAKE_RUST_TARGET=module
RUN make ${MAKE_RUST_TARGET}

FROM ghcr.io/spl/terminusdb-builder:v1 AS builder
COPY ./ /app/terminusdb
COPY --from=pack_installer /root/.local/share/swi-prolog/pack/ /usr/share/swi-prolog/pack
COPY --from=rust_builder /app/rust/librust.so /app/terminusdb/src/rust/librust.so
ARG MAKE_FINAL_TARGET=community
ARG TERMINUSDB_GIT_HASH=null
ENV TERMINUSDB_GIT_HASH=${TERMINUSDB_GIT_HASH}
ARG TERMINUSDB_JWT_ENABLED=true
ENV TERMINUSDB_JWT_ENABLED=${TERMINUSDB_JWT_ENABLED}
RUN set -eux; \
    touch src/rust/librust.so; \
    make ${MAKE_FINAL_TARGET}

FROM base
WORKDIR /app/terminusdb
COPY ./distribution/init_docker.sh /app/terminusdb/distribution/init_docker.sh
COPY --from=builder /app/terminusdb/terminusdb /app/terminusdb/terminusdb

CMD ["/app/terminusdb/distribution/init_docker.sh"]
