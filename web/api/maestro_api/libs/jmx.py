from xml.etree import ElementTree

BACKENDLISTENER_XML = """
      <BackendListener guiclass="BackendListenerGui" testclass="BackendListener" testname="Backend Listener" enabled="true">
        <elementProp name="arguments" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" enabled="true">
          <collectionProp name="Arguments.arguments">
            <elementProp name="maestroUrl" elementType="Argument">
              <stringProp name="Argument.name">maestroUrl</stringProp>
              <stringProp name="Argument.value">${__P(maestro.api.host)}</stringProp>
              <stringProp name="Argument.metadata">=</stringProp>
            </elementProp>
            <elementProp name="maestroAuthToken" elementType="Argument">
              <stringProp name="Argument.name">maestroAuthToken</stringProp>
              <stringProp name="Argument.value">${__P(maestro.api.token)}</stringProp>
              <stringProp name="Argument.metadata">=</stringProp>
            </elementProp>
            <elementProp name="maestroRunId" elementType="Argument">
              <stringProp name="Argument.name">maestroRunId</stringProp>
              <stringProp name="Argument.value">${__P(maestro.run.id)}</stringProp>
              <stringProp name="Argument.metadata">=</stringProp>
            </elementProp>
          </collectionProp>
        </elementProp>
        <stringProp name="classname">com.farfetch.jmeter.backendlistener.maestro.MaestroBackendClient</stringProp>
      </BackendListener>
    """


class Jmx:
    def __init__(self, run_plan):
        self.run_plan = ElementTree.fromstring(run_plan)

    def add_backend_listener(self):
        bl_et = ElementTree.fromstring(BACKENDLISTENER_XML)

        ht = self.run_plan.find("hashTree/hashTree")
        ht.append(bl_et)

        ElementTree.SubElement(ht, "hashTree")
        return self

    def to_bytes(self):
        return ElementTree.tostring(self.run_plan)
