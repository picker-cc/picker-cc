const pages = [
    {
        id: 'index',
        title: '基于 nest 构建的创业者专属内容框架系统',
        description: '一款为创业者打造的内容应用系统，帮助构建专属的工作室服务平台，快速整合资源为用户提供内容服务'
    },
    {
        id: 'docs-index',
        title: 'Picker 工作室内容应用系统',
        description: '一款为创业者打造的内容应用系统，帮助构建专属的工作室服务平台，快速整合资源为用户提供内容服务'
    },
    {
        id: 'docs-introduction-getting-started',
        title: 'Getting Started',
        description: 'Get started with Inkline and experience well written, designed and tested front end code.'
    },
];

module.exports = {
    byId: pages.reduce((acc, page) => {
        acc[page.id] = page;
        return acc;
    }, {}),
    allIds: pages.map((page) => page.id)
};
