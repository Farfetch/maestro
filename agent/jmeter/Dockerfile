ARG JMETER_IMAGE_BASE_REPO=
ARG JMETER_IMAGE_BASE_VERSION=
ARG JMETER_IMAGE_HEAP=

FROM ${JMETER_IMAGE_BASE_REPO}:${JMETER_IMAGE_BASE_VERSION}

# temp solution to have access to shared volumes
USER root

# Configure JAVA HEAP. Configuration should be based on the machine where test is executed
ENV HEAP=${JMETER_IMAGE_HEAP}

### MAESTRO STEPS

# COPY RUN SPECIFIC DATA
ARG JMETER_RUN_DIR

COPY $JMETER_RUN_DIR /srv/run

