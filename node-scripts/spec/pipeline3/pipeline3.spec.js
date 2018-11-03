"use strict";

describe("Tests suite for pipeline3", function() {
  const fs = require("fs");
  const path = require("path");

  const config = require(path.resolve("src/utils/config"));

  const folderInTest = path.resolve("src/" + config.getJobNameForPipeline3());

  it("should verify job parameters.", function() {
    // deps
    const __rootPath__ = require("app-root-path").path;
    const ent = require("ent");

    // replay
    var jobConfigFile = fs.readFileSync(
      __rootPath__ +
        "/../jenkins/jenkins_home/jobs/" +
        config.getJobNameForPipeline3() +
        "/config.xml",
      "utf8"
    );
    jobConfigFile = ent.decode(jobConfigFile);

    // verif
    expect(jobConfigFile).toContain(
      "<name>" + config.varInstanceUuid() + "</name>"
    );
    expect(jobConfigFile).toContain(
      "<name>" + config.varArtifactsChanges() + "</name>"
    );
    expect(jobConfigFile).toContain(
      "<name>" + config.varDeploymentChanges() + "</name>"
    );
    expect(jobConfigFile).toContain(
      "<name>" + config.varDataChanges() + "</name>"
    );
    expect(jobConfigFile).toContain(
      "<name>" + config.varCreation() + "</name>"
    );
    expect(jobConfigFile).toContain(
      "<script>node {\n  load '../jenkinsfile.groovy'\n}</script>"
    );
  });

  it("should verify pipeline steps scripts.", function() {
    // deps
    const __rootPath__ = require("app-root-path").path;

    // replay
    var jenkinsFile = fs.readFileSync(
      __rootPath__ +
        "/../jenkins/jenkins_home/jobs/" +
        config.getJobNameForPipeline3() +
        "/jenkinsfile.groovy",
      "utf8"
    );

    // verif node 'naming'
    expect(jenkinsFile).toContain(
      'def buildName = "${' + config.varInstanceUuid() + '}"'
    );
    expect(jenkinsFile).toContain(
      "if (" +
        config.varArtifactsChanges() +
        ' == "true") { cause += "artifacts + " }'
    );
    expect(jenkinsFile).toContain(
      "if (" + config.varDataChanges() + ' == "true") { cause += "data" + sep }'
    );
    expect(jenkinsFile).toContain(
      "if (" +
        config.varDeploymentChanges() +
        ' == "true") { cause += "deployment" + sep }'
    );
    expect(jenkinsFile).toContain(
      "if (" +
        config.varCreation() +
        ' == "true") { cause += "creation" + sep }'
    );

    // verif 'pre-host prepare' stage
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getPrehostPrepareJsScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh '$" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getPrehostPrepareScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getUpdateStatusJsScriptName() +
        " $" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getStatusFileName() +
        "'"
    );

    // verif 'host prepare' stage
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getHostPrepareJsScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh '$" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getHostPrepareScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getUpdateStatusJsScriptName() +
        " $" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getStatusFileName() +
        "'"
    );

    // verif 'start instance' stage
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getStartInstanceJsScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh '$" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getStartInstanceScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getUpdateStatusJsScriptName() +
        " $" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getStatusFileName() +
        "'"
    );

    // verif 'post start' stage
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getPostStartJsScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh '$" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getPostStartScriptName() +
        "'"
    );

    // verif 'startup monitoring' stage
    expect(jenkinsFile).toContain(
      "sh 'node /opt/node-scripts/src/$JOB_NAME/" +
        config.getStartupMonitoringJsScriptName() +
        "'"
    );
    expect(jenkinsFile).toContain(
      "sh '$" +
        config.varEnvvarBuildPath() +
        "/" +
        config.getStartupMonitoringScriptName() +
        "'"
    );
  });
});