import { Path, basename, dirname, join, normalize } from "@angular-devkit/core";
import { experimental } from "@angular-devkit/core";
import { WorkspaceProject, ProjectType } from "./workspace-models";

export interface Location {
  name: string;
  path: Path;
}

export function parseName(path: string, name: string): Location {
  const nameWithoutPath = basename(normalize(name));
  const namePath = dirname(join(normalize(path), name) as Path);

  return {
    name: nameWithoutPath,
    path: normalize("/" + namePath)
  };
}

export function buildDefaultPath(project: WorkspaceProject): string {
  const root = project.sourceRoot
    ? `/${project.sourceRoot}/`
    : `/${project.root}/src/`;

  const projectDirName =
    project.projectType === ProjectType.Application ? "app" : "lib";

  return `${root}${projectDirName}`;
}
