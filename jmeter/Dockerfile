# BUILD JMeter-plugins-manager plugin

FROM maven:3.8-openjdk-8-slim as jmeter-backendlistener-maestro-build

COPY ./plugins/jmeter-backendlistener-maestro/ .

RUN mvn clean install --batch-mode

# BUILD IMAGE

FROM openjdk:8u312-jre-slim as build-image

ENV JMETER_VERSION=5.4.3
ENV JMETER_HOME_FOLDER=/opt/jmeter
ENV JMETER_BIN_FOLDER=${JMETER_HOME_FOLDER}/bin
ENV JMETER_LIB_FOLDER=${JMETER_HOME_FOLDER}/lib
ENV JMETER_PLUGINS_FOLDER=${JMETER_HOME_FOLDER}/lib/ext

ENV JMETER_MIRROR=https://dlcdn.apache.org/jmeter/binaries/
ENV JMETER_DOWNLOAD_URL=${JMETER_MIRROR}/apache-jmeter-${JMETER_VERSION}.tgz

ENV JMETER_PLUGINS_MANAGER_VERSION 1.7
ENV CMDRUNNER_VERSION 2.2

RUN apt-get update && apt-get install --no-install-recommends -y curl

# Download and Unpack JMeter
RUN curl -s ${JMETER_DOWNLOAD_URL} | tar zxv -C /opt && mv /opt/apache-jmeter-${JMETER_VERSION} ${JMETER_HOME_FOLDER}

COPY --from=jmeter-backendlistener-maestro-build  /root/.m2/repository/com/farfetch/jmeter-backendlistener-maestro/0.0.1/jmeter-backendlistener-maestro-0.0.1.jar ${JMETER_PLUGINS_FOLDER}


# Install JMeter Plugins Manager
RUN curl -L -o ${JMETER_PLUGINS_FOLDER}/jmeter-plugins-manager-${JMETER_PLUGINS_MANAGER_VERSION}.jar "https://repo1.maven.org/maven2/kg/apc/jmeter-plugins-manager/${JMETER_PLUGINS_MANAGER_VERSION}/jmeter-plugins-manager-${JMETER_PLUGINS_MANAGER_VERSION}.jar"
RUN curl -L -o ${JMETER_LIB_FOLDER}/cmdrunner-${CMDRUNNER_VERSION}.jar "https://repo1.maven.org/maven2/kg/apc/cmdrunner/${CMDRUNNER_VERSION}/cmdrunner-${CMDRUNNER_VERSION}.jar"
RUN java -cp ${JMETER_PLUGINS_FOLDER}/jmeter-plugins-manager-${JMETER_PLUGINS_MANAGER_VERSION}.jar org.jmeterplugins.repository.PluginManagerCMDInstaller

WORKDIR ${JMETER_HOME_FOLDER}

COPY jmeter_plugins.txt .

# Install JMeter Plugins
RUN while read -r line; do "${JMETER_BIN_FOLDER}/PluginsManagerCMD.sh" install "${line}"; done < jmeter_plugins.txt

WORKDIR ${JMETER_BIN_FOLDER}


# RUNTIME IMAGE
FROM openjdk:8u312-jre-slim as runtime-image

RUN useradd -ms /bin/bash maestrouser

USER maestrouser

COPY --chown=maestrouser:maestrouser --from=build-image /opt/jmeter /opt/jmeter

WORKDIR /opt/jmeter/bin

ENTRYPOINT ["./jmeter"]
CMD [ "--?" ]

EXPOSE 50000
EXPOSE 1099
