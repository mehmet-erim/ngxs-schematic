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
  FileEntry
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

export default function(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
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
            let updated = "";
            updated = (content.toString() + file.content.toString())
              .split("\n")
              .filter(line => !!line)
              .sort()
              .join("\n");
            tree.overwrite(file.path, updated);
          }
        }
        return null;
      })
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}
