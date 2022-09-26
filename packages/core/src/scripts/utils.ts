import path from 'path';

export function getConfigPath(cwd: string) {
  return path.join(cwd, 'picker');
}

export function getAdminPath(cwd: string) {
  return path.join(cwd, '.picker/admin');
}

export class ExitError extends Error {
  code: number;
  constructor(code: number) {
    super(`The process should exit with ${code}`);
    this.code = code;
  }
}
