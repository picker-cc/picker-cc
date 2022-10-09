import meow from "meow";
import {ExitError} from "./utils";
import {prisma} from "../cli/prisma";
import {postinstall} from "../cli/postinstall";
const commands = { prisma, postinstall };

export async function cliMeow(cwd: string, argv: string[]) {
    const {input, help, flags } = meow(
        `
        使用
            $ picker [command]
        命令
            dev             以开发模式启动项目(默认)
            postinstall     生成客户端 APIs 和 types(可选)
            build           构建项目(必须在使用 start 之前完成)
            start           在生产模式下启动项目
            prisma          安全运行 Prisma CLI 命令
        `,
        {
            importMeta: undefined,
            flags: {
                fix: { default: false, type: 'boolean' },
                resetDb: { default: false, type: 'boolean' },
            },
            argv
        }
    );
    const command = input[0] || 'dev';
    if (!isCommand(command)) {
        console.log(`${command} is not a command that keystone accepts`);
        console.log(help);
        throw new ExitError(1);
    }

    if (command === 'prisma') {
        return prisma(cwd, argv.slice(1));
    } else if (command === 'postinstall') {
        return postinstall(cwd, flags.fix);
    }
    // } else if (command === 'dev') {
    //     return dev(cwd, flags.resetDb);
    // } else {
    //     return commands[command](cwd);
    // }
}


function isCommand(command: string): command is keyof typeof commands {
    return command in commands;
}

