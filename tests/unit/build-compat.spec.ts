import fs from "fs";
import path from "path";

describe("build compatibility", () => {
  it("does not depend on the native forcefocus module", () => {
    const packageJsonPath = path.resolve(__dirname, "../../package.json");
    const managerPath = path.resolve(
      __dirname,
      "../../src/main/views/manager.ts"
    );
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const managerSource = fs.readFileSync(managerPath, "utf8");

    expect(packageJson.dependencies).not.toHaveProperty(
      "@adeperio/forcefocus"
    );
    expect(managerSource).not.toContain('@adeperio/forcefocus');
  });

  it("does not block production packaging on legacy lint debt", () => {
    const vueConfigPath = path.resolve(__dirname, "../../vue.config.js");
    const vueConfigSource = fs.readFileSync(vueConfigPath, "utf8");

    expect(vueConfigSource).toContain(
      'lintOnSave: process.env.NODE_ENV !== "production"'
    );
  });
});
