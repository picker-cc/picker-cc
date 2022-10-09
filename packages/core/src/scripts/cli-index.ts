import { cliMeow } from './cli';
import { ExitError } from './utils';

cliMeow(process.cwd(), process.argv.slice(2)).catch(err => {
    if (err instanceof ExitError) {
        process.exit(err.code);
    }
    console.log(err);
    process.exit(1);
});
