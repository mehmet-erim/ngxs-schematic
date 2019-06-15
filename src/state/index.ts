import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  mergeWith
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

// Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function(options: any): Rule {
  // The chain rule allows us to chain multiple rules and apply them one after the other.
  return (tree: Tree, context: SchematicContext) => {
    const sourceTemplates = url("./files");

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings
      })
    ]);

    return mergeWith(sourceParametrizedTemplates);
  };
}
