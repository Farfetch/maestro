from maestro_api.libs.jmx import BACKENDLISTENER_XML, Jmx

RUN_PLAN_XML = """
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.4.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan" enabled="true">
      <stringProp name="TestPlan.comments" />
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
        <collectionProp name="Arguments.arguments" />
      </elementProp>
      <stringProp name="TestPlan.user_define_classpath" />
    </TestPlan>
    <hashTree />
  </hashTree>
</jmeterTestPlan>
"""


class TestJmx:
    def test_add_backend_listener(self):
        jmx = Jmx(RUN_PLAN_XML)
        assert (
            BACKENDLISTENER_XML.strip().encode()
            in jmx.add_backend_listener().to_bytes()
        )

    def test_to_string(self):
        jmx = Jmx(RUN_PLAN_XML)
        assert RUN_PLAN_XML.strip().encode() == jmx.to_bytes()
