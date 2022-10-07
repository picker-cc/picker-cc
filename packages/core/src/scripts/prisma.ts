import {execa} from 'execa';
import {ExitError, getConfigPath} from './utils';
import {initConfig} from "../schema/initConfig";
import {createSystem} from "../createSystem";
import {generateNodeModulesArtifacts, validateCommittedArtifacts} from "../schema/artifacts";

export async function prisma(cwd: string, args: string[]) {
    const config = initConfig(require(getConfigPath(cwd)).default);

    const {graphQLSchema} = createSystem(config);

    await validateCommittedArtifacts(graphQLSchema, config, cwd);
    await generateNodeModulesArtifacts(graphQLSchema, config, cwd);

    const result = await execa('node',
        [require.resolve('prisma'), ...args],
        {
            cwd,
            stdio: 'inherit',
            reject: false,
            env: {
                ...process.env,
                DATABASE_URL: config.db.url,
                PRISMA_HIDE_UPDATE_MESSAGE: '1',
            },
        });
    if (result.exitCode !== 0) {
        throw new ExitError(result.exitCode);
    }
}
