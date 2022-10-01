import {checkbox, list, password, relationship, select, text, timestamp} from "@picker-cc/core";
import {trackingFields} from "./utils";


export const Post = list({
    // access: {
    //     operation: {
    //         delete: ({ session }) => session?.data.isAdmin,
    //     }
    // },
    ui: {},
    fields: {
        title: text({
            validation: {
                isRequired: true
            }
        }),
        slug: text({
            isIndexed: 'unique',
            validation: {
                isRequired: true
            }
        }),
        // deletedAt: timestamp({
        //     defaultValue: { kind: 'now' }
        // }),
        // featured:
        ...trackingFields,
        status: select({
            type: 'enum',
            options: [
                {label: '草稿', value: 'draft'},
                {label: '已发布', value: 'published'}
            ]
        }),
        content: text({}),
        publishDate: timestamp(),
        user: relationship({
            ref: 'User.posts',
            hooks: {
                resolveInput({ operation, resolvedData, context }) {
                    // Default to the currently logged in user on create.
                    if (operation === 'create' && !resolvedData.user && context.session?.itemId) {
                        return { connect: { id: context.session?.itemId } };
                    }
                    return resolvedData.user;
                },
            },
        })
        // allowComment
        // administrator: relationship({
        //     ref: 'Administrator.user',
        // })
    }
})
