import {checkbox, list, password, relationship, text, timestamp} from "@picker-cc/core";
import {trackingFields} from "./utils";


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
    ui: {},
    fields: {
        name: text({
            validation: {
                isRequired: true
            }
        }),
        identifier: text({
            isIndexed: 'unique',
            validation: {
                isRequired: true
            }
        }),
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
