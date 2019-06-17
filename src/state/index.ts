import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  mergeWith,
  move,
  forEach,
  FileEntry,
  SchematicsException
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { Schema } from "./schema";
import { parseName, buildDefaultPath } from "../utils";

export default function(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");
    if (!workspaceConfigBuffer) {
      throw new SchematicsException("Not an ANGULAR CLI workspace");
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];

    const defaultProjectPath = buildDefaultPath(project);

    const parsedPath = parseName(defaultProjectPath, options.name);

    const { name, path } = parsedPath;

    console.log(parsedPath);

    if (!options.path) {
      options.path = "/src/app/store/";
    }

    const sourceTemplates = url("./files");

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings
      }),
      move(options.path),
      forEach((file: FileEntry) => {
        if (!tree.exists(file.path)) return file;

        if (file.path.substr(file.path.lastIndexOf("/") + 1) === "index.ts") {
          const content: Buffer | null = tree.read(file.path);
          // console.log((content as Buffer).toString());
          if (content && !content.toString().includes(options.name)) {
            let updatedContent = "";
            updatedContent = (content.toString() + file.content.toString())
              .split("\n")
              .filter(line => !!line)
              .sort()
              .join("\n");

            tree.overwrite(file.path, updatedContent);
          }
        }
        return null;
      })
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}
