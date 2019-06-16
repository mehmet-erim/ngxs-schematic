import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  mergeWith,
  move
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
      move(options.path)
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}
