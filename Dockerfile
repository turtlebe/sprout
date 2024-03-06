# syntax=docker/dockerfile:experimental
# ================================= PRODUCTION DOCKERFILE ================================
FROM python:3.8.10-buster

WORKDIR /app

RUN apt-get update
RUN apt-get install -y \
  curl
RUN pip install --upgrade setuptools pip pipenv

# Install node and yarn
ARG INSTALL_NODE_VERSION=${INSTALL_NODE_VERSION:-16}
RUN curl -L https://deb.nodesource.com/setup_${INSTALL_NODE_VERSION:-16}.x | bash -
RUN apt-get install -y \
  nodejs \
  && apt-get -y autoclean
ARG INSTALL_YARN_VERSION=${INSTALL_YARN_VERSION:-1.22.4}
RUN npm install -g yarn@${INSTALL_YARN_VERSION}

# Install memcached and prepare SSH
RUN apt-get install -y memcached nginx
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Install Backend Dependencies
COPY ["Pipfile", "Pipfile.lock", "./"]
RUN --mount=type=ssh pipenv install --dev

# Install Frontend Dependencies
COPY ["frontend/package.json", "./frontend/"]
COPY ["frontend/yarn.lock", "./frontend/"]
COPY ["frontend/app-api-docs/package.json", "./frontend/app-api-docs/"]
COPY ["frontend/app-crops-skus/package.json", "./frontend/app-crops-skus/"]
COPY ["frontend/app-data-docs/package.json", "./frontend/app-data-docs/"]
COPY ["frontend/app-derived-observations/package.json", "./frontend/app-derived-observations/"]
COPY ["frontend/app-devices/package.json", "./frontend/app-devices/"]
COPY ["frontend/app-environment/package.json", "./frontend/app-environment/"]
COPY ["frontend/app-ignition-tag-registry/package.json", "./frontend/app-ignition-tag-registry/"]
COPY ["frontend/app-help/package.json", "./frontend/app-help/"]
COPY ["frontend/app-lab-testing/package.json", "./frontend/app-lab-testing/"]
COPY ["frontend/app-perception/package.json", "./frontend/app-perception/"]
COPY ["frontend/app-production/package.json", "./frontend/app-production/"]
COPY ["frontend/app-production-admin/package.json", "./frontend/app-production-admin/"]
COPY ["frontend/app-quality/package.json", "./frontend/app-quality/"]
COPY ["frontend/app-utilities/package.json", "./frontend/app-utilities/"]
COPY ["frontend/brand-ui/package.json", "./frontend/brand-ui/"]
COPY ["frontend/client/package.json", "./frontend/client/"]
COPY ["frontend/core/package.json", "./frontend/core/"]
COPY ["frontend/eslint-config/package.json", "./frontend/eslint-config/"]
COPY ["frontend/farmos-navbar/package.json", "./frontend/farmos-navbar/"]
COPY ["frontend/jest-config/package.json", "./frontend/jest-config/"]
RUN yarn --cwd frontend

# Copy infrastructure configurations
COPY deploy/prod/supervisord.conf /etc/supervisor/supervisord.conf
COPY deploy/prod/nginx.conf /etc/nginx/nginx.conf.template
COPY deploy/prod/supervisord_programs /etc/supervisor/conf.d

# Copy Frontend sources and build frontend assets
COPY ["frontend", "./frontend/"]
RUN yarn --cwd frontend/client build

# Copy all sources (e.g backend)
COPY [".", "./"]

ARG CIRCLE_SHA1
ENV CIRCLE_SHA1=$CIRCLE_SHA1

EXPOSE 80
ENTRYPOINT ["/bin/bash", "deploy/prod/supervisord_entrypoint.sh"]
CMD ["-c", "/etc/supervisor/supervisord.conf"]
