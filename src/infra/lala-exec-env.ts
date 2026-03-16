export const LALA_CLI_ENV_VAR = "LALA_CLI";
export const LALA_CLI_ENV_VAR = "LALA_CLI";
export const LALA_CLI_ENV_VALUE = "1";

export function markLalaExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [LALA_CLI_ENV_VAR]: LALA_CLI_ENV_VALUE,
    [LALA_CLI_ENV_VAR]: LALA_CLI_ENV_VALUE,
  };
}

export function ensureLalaExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[LALA_CLI_ENV_VAR] = LALA_CLI_ENV_VALUE;
  env[LALA_CLI_ENV_VAR] = LALA_CLI_ENV_VALUE;
  return env;
}
