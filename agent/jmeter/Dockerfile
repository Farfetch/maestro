ARG JMETER_IMAGE_BASE_REPO=
ARG JMETER_IMAGE_BASE_VERSION=

FROM ${JMETER_IMAGE_BASE_REPO}:${JMETER_IMAGE_BASE_VERSION}

# temp solution to have access to shared volumes
USER root

ARG JMETER_IMAGE_HEAP=
ARG JMETER_RUN_DIR

# Configure JAVA HEAP. Configuration should be based on the machine where test is executed
ENV HEAP=${JMETER_IMAGE_HEAP}

### MAESTRO STEPS

# COPY RUN SPECIFIC DATA
COPY $JMETER_RUN_DIR /srv/run

