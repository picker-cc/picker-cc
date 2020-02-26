import pages from '@/pages.config';

export function head(id, options = {}) {
    const page = pages.byId[id];
    const titlePostamble = ' - Picker';
    const descriptionPostamble = ' Picker 是一个基于 nestjs 构建的内容框架系统.';

    const title = page.title + (options.preserve && options.preserve.title ? '' : titlePostamble);
    const description = page.description + (options.preserve && options.preserve.description ? '' : descriptionPostamble);

    return function () {
        const routerPath = this.$route.fullPath.replace(/\/$/, '');

        return {
            title,
            link: [
                { rel: 'canonical', href: 'https://picker.cc' + routerPath },
            ],
            meta: [
                { hid: 'description', name: 'description', content: description },
                { hid: 'description', name: 'description', content: description },
                { hid: `og:title`, property: 'og:title', content: title },
                { hid: `og:description`, property: 'og:description', content: description },
                { hid: `og:url`, property: 'og:url', content: 'https://picker.cc' + routerPath },
            ]
        }
    };
}
