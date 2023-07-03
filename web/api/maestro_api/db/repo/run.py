from maestro_api.db.models.run import Run
from maestro_api.db.models.run_configuration import RunConfiguration
from maestro_api.db.models.agent import Agent
from maestro_api.db.models.run_agent import RunAgent
from maestro_api.db.models.run_metric import RunMetric
from maestro_api.db.models.run_metric_label import RunMetricLabel


class RunRepository:
    """
    Repository to manage common opperation over run and related agents
    """

    def create_run(self, run_configuration: RunConfiguration):
        hosts = [host.to_mongo() for host in run_configuration.hosts]
        load_profile = [
            load_profile_step.to_mongo()
            for load_profile_step in run_configuration.load_profile
        ]

        custom_properties = [
            custom_property.to_mongo()
            for custom_property in run_configuration.custom_properties
        ]

        new_run = Run(
            title=run_configuration.title,
            run_configuration_id=run_configuration.id,
            workspace_id=run_configuration.workspace_id,
            agent_ids=run_configuration.agent_ids,
            run_plan_id=run_configuration.run_plan_id,
            custom_data_ids=run_configuration.custom_data_ids,
            labels=run_configuration.labels,
            load_profile=load_profile,
            hosts=hosts,
            custom_properties=custom_properties,
            is_load_profile_enabled=run_configuration.is_load_profile_enabled
        ).save()

        agent_ids = run_configuration.agent_ids

        agents = Agent.objects(id__in=agent_ids)
        run_agents = [
            RunAgent(
                run_id=new_run.id, agent_id=agent.id, agent_hostname=agent.hostname
            )
            for agent in agents
        ]

        RunAgent.objects.insert(run_agents)

        return new_run

    def delete_with_related(self, run: Run):
        "Delete Run and all related documents"

        RunMetric.objects(run_id=run.id).delete()
        RunMetricLabel.objects(run_id=run.id).delete()
        RunAgent.objects(run_id=run.id).delete()

        run.delete()

        return run
