---
sidebar_position: 1
---

# First Test Execution

Once you have environment up & running, it's time to run the test.

Before you start exploring Maestro, let's create Jmeter test that needs to be executed. You can download just smoke test to see Maestro from action from [here](../assets/jmx/dummy_sampler.jmx).

## Create Test

Maestro test is reusable configuration from where you can start test. The configuration is connected to all runs that makes possible to run the test quickly and know which configuration was used.

To create a test, you should go to `/tests/new` or `/tests` and click on the `Create` button.

By using Test Configuration form you can configure everything you need to start a test.

### Agents

![Agents confgiuration](../assets/getting_started/agents.webp)

There two types of agents that used by Maestro. Client agent can be only one host and responsible for:

- Sending real-time metrics to the API
- Controlling state of Server agents once something goes wrong.

Speaking about server agents, they are mostly doing test execution by running Jmeter containers.

Both, client and server agents are running the same Jmeter image with all custom data available inside. The only difference in test execution is Jmeter container command.

###
