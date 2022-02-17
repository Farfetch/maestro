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


def inject_backendlistener(original_plan):
    test_plan = ElementTree.fromstring(original_plan)
    bl_et = ElementTree.fromstring(BACKENDLISTENER_XML)

    ht = test_plan.find("hashTree/hashTree")
    ht.append(bl_et)

    ElementTree.SubElement(ht, "hashTree")

    return ElementTree.tostring(test_plan)
