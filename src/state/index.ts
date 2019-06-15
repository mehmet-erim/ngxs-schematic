import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";

// Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function(options: any): Rule {
  // The chain rule allows us to chain multiple rules and apply them one after the other.
  return (tree: Tree, context: SchematicContext) => {
    // Show the options for this Schematics.
    // The logging here is at the discretion of the tooling. It can be ignored or only showing
    // info/warnings/errors. If you use console.log() there is not guarantee it will be
    // propagated to a user in any way (for example, an IDE running this schematic might
    // have a logging window but no support for console.log).
    context.logger.info("My Schematic: " + JSON.stringify(options));

    // Create a single file. This is the simplest example of transforming the tree.
    // If a file with that name already exists, the generation will NOT fail until the tool
    // is trying to commit this to disk. This is because we allow you to work on what is
    // called a "staging" area, and only finalize those changes when the schematics is
    // done. This allows you to create files without having to verify if they exist
    // already, then rename them later. Templating works in a similar fashion.
    tree.create("hello", "world");

    // At the end, you can either return a Tree (that will be used), or an observable of a
    // Tree (if you have some asynchronous tasks).
    return tree;
  };
}
