import {
  Path,
  basename,
  dirname,
  join,
  normalize,
  relative,
  extname,
} from '@angular-devkit/core';
import { experimental } from '@angular-devkit/core';
import { WorkspaceProject, ProjectType } from './workspace-models';

export interface Location {
  name: string;
  path: Path;
}

export function parseName(path: string, name: string): Location {
  const nameWithoutPath = basename(normalize(name));
  const namePath = dirname(join(normalize(path), name) as Path);

  return {
    name: nameWithoutPath,
    path: normalize('/' + namePath),
  };
}

export function buildDefaultPath(project: WorkspaceProject): string {
  const root = project.sourceRoot
    ? `/${project.sourceRoot}/`
    : `/${project.root}/src/`;

  const projectDirName =
    project.projectType === ProjectType.Application ? 'app' : 'lib';

  return `${root}${projectDirName}`;
}

export function buildRelativePath(from: string, to: string): string {
  const {
    path: fromPath,
    filename: fromFileName,
    directory: fromDirectory,
  } = parsePath(from);
  const {
    path: toPath,
    filename: toFileName,
    directory: toDirectory,
  } = parsePath(to);
  const relativePath = relative(fromDirectory, toDirectory);
  const fixedRelativePath = relativePath.startsWith('.')
    ? relativePath
    : `./${relativePath}`;

  return !toFileName || toFileName === 'index.ts'
    ? fixedRelativePath
    : `${
        fixedRelativePath.endsWith('/')
          ? fixedRelativePath
          : fixedRelativePath + '/'
      }${convertToTypeScriptFileName(toFileName)}`;
}

function parsePath(path: string) {
  const pathNormalized = normalize(path) as Path;
  const filename = extname(pathNormalized) ? basename(pathNormalized) : '';
  const directory = filename ? dirname(pathNormalized) : pathNormalized;
  return {
    path: pathNormalized,
    filename,
    directory,
  };
}

function convertToTypeScriptFileName(filename: string | undefined) {
  return filename ? filename.replace(/(\.ts)|(index\.ts)$/, '') : '';
}
