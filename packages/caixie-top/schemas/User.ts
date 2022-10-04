import {checkbox, image, list, password, relationship, text, timestamp} from "@picker-cc/core";
import {trackingFields} from "./utils";
import {SmsEvent} from "@picker-cc/ali-sms-plugin";
import {generateCode} from "@picker-cc/common/lib/generate-public-id";


export const User = list({
    access: {
        operation: {
            create: ({ session }) => {
                return session?.data.isAdmin
            },
            delete: ({session}) => {
                return session?.data.isAdmin
            },
        }
    },
    hooks: {
        beforeOperation({operation, resolvedData, context}) {
            // context.eventBus.publish(new SmsEvent('verification', '13488689885', resolvedData.verifyCode))
        },
        resolveInput({operation, resolvedData, context}) {
            // if (operation === 'create') {
                // resolvedData.verifyCode = generateCode(6)
                // resolvedData.verifyCodeCreatedAt = new Date()
            // }
            return resolvedData
        }
    },
    ui: {},
    fields: {
        name: text({}),
        identifier: text({
            isIndexed: 'unique',
            validation: {
                isRequired: true
            }
        }),
        // 个人介绍
        detail: text(),
        avatar: text(),
        // avatar: image({ storage: ''}),
        deletedAt: timestamp({
            defaultValue: {kind: 'now'}
        }),
        // featured:
        ...trackingFields,
        verified: checkbox({}),
        enabled: checkbox({}),
        lastLogin: timestamp({
            defaultValue: {kind: 'now'}
        }),

        verifyCode: text(),
        verifyCodeCreatedAt: timestamp(),
        password: password({
            access: {
                update: ({session, item}) => {
                    return session && (session.data.isAdmin || session.itemId === item.id)
                }
            }
        }),
        isAdmin: checkbox({
            access: {
                create: ({session}) => session?.data.isAdmin,
                update: ({session}) => session?.data.isAdmin,
            }
        }),
        posts: relationship({ref: 'Post.user', many: true})
    }
})
