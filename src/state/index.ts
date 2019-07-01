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
  SchematicsException,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from './schema';
import {
  buildDefaultPath,
  buildRelativePath,
  addImportToModule,
  insertImport,
  InsertChange,
} from '../utils';
import * as ts from 'typescript';

export default function(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read('angular.json');
    if (!workspaceConfigBuffer) {
      throw new SchematicsException('Not an ANGULAR CLI workspace');
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];
    const isLibrary = project.projectType === 'library';
    const defaultProjectPath = buildDefaultPath(project);

    options.forRoot =
      ((options.forRoot as unknown) as string) == 'true' || undefined;

    if (options.forRoot !== true) {
      options.forRoot =
        ((options.forRoot as unknown) as string) == 'false'
          ? false
          : !isLibrary;
    }

    options.skipImport =
      ((options.skipImport as unknown) as string) == 'true' || false;

    if (!options.path) {
      options.path = `${defaultProjectPath}/${isLibrary ? '' : 'store/'}`;
    } else {
      console.log(options.path.substr(options.path.length));
      if (options.path.substr(0, 1) !== '/') {
        options.path = '/' + options.path;
      }

      if (options.path.substr(options.path.length - 1) !== '/') {
        options.path = '/' + options.path;
      }
    }

    const sourceTemplates = url('./files');

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings,
      }),
      move(options.path),
      forEach((file: FileEntry) => {
        if (!tree.exists(file.path)) return file;

        if (file.path.substr(file.path.lastIndexOf('/') + 1) === 'index.ts') {
          const content: Buffer | null = tree.read(file.path);

          if (content && !content.toString().includes(options.name)) {
            let updatedContent = '';
            updatedContent = (content.toString() + file.content.toString())
              .split('\n')
              .filter(line => !!line)
              .sort()
              .join('\n');

            tree.overwrite(file.path, updatedContent);
          }
        }
        return null;
      }),
    ]);

    if (!options.skipImport) {
      overwriteModule(tree, options, isLibrary, defaultProjectPath);
    }

    return mergeWith(sourceParametrizedTemplates);
  };
}

function overwriteModule(
  tree: Tree,
  options: Schema,
  isLibrary: boolean,
  defaultProjectPath: string,
) {
  if (!options.module) {
    options.module = isLibrary
      ? `${defaultProjectPath}/${options.project}.module.ts`
      : `${defaultProjectPath}/app.module.ts`;
  }
  if (tree.exists(options.module)) {
    const content: Buffer | null = tree.read(options.module);

    const moduleContent = (content as Buffer).toString('utf-8');

    const statePath = `${options.path}states/${options.name}.state.ts`;
    const relativePath = buildRelativePath(options.module, statePath);

    const source = ts.createSourceFile(
      options.module,
      moduleContent,
      ts.ScriptTarget.Latest,
      true,
    );

    const isImported =
      moduleContent.indexOf(
        `NgxsModule.${options.forRoot ? 'forRoot' : 'forFeature'}(`,
      ) > -1;

    const storeNgModuleImport = addImportToModule(
      source,
      options.module,
      options.forRoot
        ? `NgxsModule.forRoot([${strings.classify(options.name)}State])`
        : `NgxsModule.forFeature([${strings.classify(options.name)}State])`,
      relativePath,
    ).shift();

    const commonImports = [
      insertImport(source, options.module, 'NgxsModule', '@ngxs/store'),
      insertImport(
        source,
        options.module,
        `${strings.classify(options.name)}State`,
        `${relativePath}`,
      ),
      ...(isImported ? [] : [storeNgModuleImport]),
    ];

    const changes = [...commonImports];
    const recorder = tree.beginUpdate(options.module);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    tree.commitUpdate(recorder);

    if (isImported) {
      const newContent = (tree.read(options.module) as Buffer).toString(
        'utf-8',
      );

      const contentArr = newContent.split('\n');

      let lineIndex = -1;
      const index = contentArr.findIndex(line => {
        const i = line.indexOf(
          `NgxsModule.for${options.forRoot ? 'Root' : 'Feature'}(`,
        );
        if (i > -1) {
          lineIndex = i;
          return true;
        }
        return false;
      });

      if (
        contentArr[index].indexOf(`${strings.classify(options.name)}State`) < 0
      ) {
        const focusIndex = contentArr[index].substr(lineIndex).indexOf('([');
        if (focusIndex > -1) {
          contentArr[index] =
            contentArr[index].substr(0, lineIndex + focusIndex + 2) +
            `${strings.classify(options.name)}State, ` +
            contentArr[index].substr(lineIndex + focusIndex + 2);
        } else {
          const focusIndex2 = contentArr[index].substr(lineIndex).indexOf('(');
          contentArr[index] =
            contentArr[index].substr(0, lineIndex + focusIndex2 + 1) +
            `[${strings.classify(options.name)}State]` +
            contentArr[index].substr(lineIndex + focusIndex2 + 1);
        }

        tree.overwrite(options.module, contentArr.join('\n'));
      }
    }
  }
}
