export const LALA_CLI_ENV_VAR = "LALA_CLI";
export const OPENCLAW_CLI_ENV_VAR = "OPENCLAW_CLI";
export const LALA_CLI_ENV_VALUE = "1";

export function markLalaExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [LALA_CLI_ENV_VAR]: LALA_CLI_ENV_VALUE,
    [OPENCLAW_CLI_ENV_VAR]: LALA_CLI_ENV_VALUE,
  };
}

export function ensureLalaExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[LALA_CLI_ENV_VAR] = LALA_CLI_ENV_VALUE;
  env[OPENCLAW_CLI_ENV_VAR] = LALA_CLI_ENV_VALUE;
  return env;
}
