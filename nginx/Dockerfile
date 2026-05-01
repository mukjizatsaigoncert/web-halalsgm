# Build nginx with brotli module from source.
# Based on official nginx alpine image — no dependency on third-party images.
FROM nginx:1.27-alpine AS builder

RUN apk add --no-cache \
    git build-base cmake linux-headers openssl-dev pcre2-dev zlib-dev wget

# Clone ngx_brotli and its dependencies
RUN git clone --recurse-submodules --depth=1 \
    https://github.com/google/ngx_brotli /tmp/ngx_brotli

# Build brotli encoder/decoder library
RUN cd /tmp/ngx_brotli/deps/brotli && \
    mkdir -p out && cd out && \
    cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF \
          -DCMAKE_C_FLAGS="-Ofast -march=native -mtune=native -flto -funroll-loops -ffunction-sections -fdata-sections -Wl,--gc-sections" \
          -DCMAKE_CXX_FLAGS="-Ofast -march=native -mtune=native -flto -funroll-loops -ffunction-sections -fdata-sections -Wl,--gc-sections" \
          -DCMAKE_INSTALL_PREFIX=./installed .. && \
    cmake --build . --config Release -j4 --target brotlienc

# Get nginx source matching the installed version
RUN NGINX_VERSION=$(nginx -v 2>&1 | sed 's/.*nginx\///') && \
    wget -q "https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" -O /tmp/nginx.tar.gz && \
    tar -C /tmp -xzf /tmp/nginx.tar.gz && \
    mv /tmp/nginx-${NGINX_VERSION} /tmp/nginx

# Build only the brotli dynamic modules.
# Use --with-compat + the exact configure args from the installed nginx binary
# so the .so ABI matches the running nginx.
RUN cd /tmp/nginx && \
    NGINX_CONFIGURE_ARGS=$(nginx -V 2>&1 | grep 'configure arguments:' | sed 's/.*configure arguments: //') && \
    eval "./configure --with-compat --add-dynamic-module=/tmp/ngx_brotli ${NGINX_CONFIGURE_ARGS}" && \
    make modules -j$(nproc)

# ---- Final image ----
FROM nginx:1.27-alpine
COPY --from=builder /tmp/nginx/objs/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/
COPY --from=builder /tmp/nginx/objs/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/

