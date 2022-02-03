---
sidebar_position: 1
---

# Setup environment

Maestro is a deployable application that consists of a few services that ideally should run in the same network to have proper access.

## Requirements

We do have some environment requirements that you have to check manually to make sure all the following steps are working properly.

- docker >=20.10
- docker-compose >=2.2.1

## Quick start

The commands below would help to get the application up and running. It also will give a general feeling of how it works.

Before you continue, make sure the `/tmp/maestrojmeter` folder is created and exists. The folder would be used to store all temporary data from Jmeter and mostly used as the shared volume between Maestro containers and Jmeter ones.

```bash
mkdir -p /tmp/maestrojmeter
```

**Run application**:

```bash
docker-compose up
```

As a result, you can navigate to `http://localhost:3000` and explore the [list of features we have](../intro.md).

## Jmeter image

Maestro doesn't provide any default Jmeter image and allows the use of the one you already have.

To use your own docker image, open `docker-compose.yml` file to add `JMETER_IMAGE_BASE_REPO`and `JMETER_IMAGE_BASE_VERSION` to the Maestro agent application. The image would be used as a based one and allow you to have the same Jmeter version along with all needed plugins that you already used. Maestro is only responsible for adding more data, such as test plans, custom data, etc there. The Dockerfile is available in [GitHub](https://github.com/Farfetch/maestro/blob/master/agent/jmeter/Dockerfile).
