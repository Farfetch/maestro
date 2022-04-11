ARG PYTHON_RUNTIME_REPO=python
ARG PYTHON_RUNTIME_VERSION=3.9.5


FROM ${PYTHON_RUNTIME_REPO}:${PYTHON_RUNTIME_VERSION} as core-image

# TODO: use maestro user for running image instead of ROOT
# root user is used because of permissions needed to use docker.sock file
RUN useradd -ms /bin/bash maestro
USER maestro
RUN mkdir /home/maestro/app
WORKDIR /home/maestro/app

ENV PATH="/home/maestro/.local/bin:${PATH}"

RUN python -m pip install --upgrade pip==22.0.4
RUN python -m pip install pipenv==2022.3.23

COPY . .

FROM core-image as runtime-image

COPY --chown=maestro:maestro --from=core-image /home/maestro/app /home/maestro/app

RUN python -m pipenv install --system --deploy


ENTRYPOINT ["python","cli.py",]
