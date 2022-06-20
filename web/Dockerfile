ARG PYTHON_RUNTIME_REPO=python
ARG PYTHON_RUNTIME_VERSION=3.9.5

ARG NODEJS_BUILD_REPO=node
ARG NODEJS_BUILD_VERSION=16.15.1

FROM ${PYTHON_RUNTIME_REPO}:${PYTHON_RUNTIME_VERSION} as core-image

# Create maestro user
RUN useradd -ms /bin/bash maestro
USER maestro
RUN mkdir /home/maestro/app
WORKDIR /home/maestro/app

ENV PATH="/home/maestro/.local/bin:${PATH}"

RUN python -m pip install --upgrade pip==22.0.4
RUN python -m pip install pipenv==2022.3.23

COPY --chown=maestro:maestro api .
RUN rm -rf frontend

# PYTHON BUILD
FROM core-image as build

COPY --chown=maestro:maestro --from=core-image /home/maestro/app /home/maestro/app

RUN python -m pipenv install --system --dev

# FRONTEND BUILD
FROM ${NODEJS_BUILD_REPO}:${NODEJS_BUILD_VERSION} as frontend-build

# Create maestro user
RUN useradd -ms /bin/bash maestro
USER maestro
RUN mkdir /home/maestro/app
WORKDIR /home/maestro/app

COPY --chown=maestro:maestro frontend .

RUN yarn install --immutable

RUN yarn build


# RUNTIME PYTHON IMAGE
FROM core-image as runtime-image

COPY --chown=maestro:maestro --from=core-image /home/maestro/app /home/maestro/app

RUN mkdir /home/maestro/app/frontend_build
COPY --chown=maestro:maestro --from=frontend-build /home/maestro/app/build /home/maestro/app/frontend_build

RUN python -m pipenv install --system --deploy

ENTRYPOINT ["bash","docker-entrypoint.sh"]

