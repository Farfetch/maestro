---
sidebar_position: 4
---

# Docker images

Images are available per each release with the same tag. The build is done by using GitHub Actions and hosted in Docker Registry.

We highly recommend using the same version of all components to make sure all features are working as expected.

- [farfetchoss/maestro](https://hub.docker.com/r/farfetchoss/maestro)
- [farfetchoss/maestro-agent](https://hub.docker.com/r/farfetchoss/maestro-agent)

## Using beta builds

If you're interested to test some features out before it goes to a specific release, you can use tags started with `beta` like in the following example:

```bash
docker pull farfetchoss/maestro:beta-ba6e32c
```

**Do not use those tags for production environments**. Using those tags on production can lead to some unexpected issues, we highly recommend avoiding migrations to beta versions.
