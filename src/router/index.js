import asyncComponent from "@/components/AsyncComponent";

const routes = [
    {
        path: "/post",
        meta: {
            title: "博客管理",
            position: "sidebar",
            icon: "fa-book"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/post/index`))
    },
    {
        path: "/tag",
        meta: {
            title: "标签管理",
            position: "sidebar",
            icon: "fa-tags"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/tag/index`))
    },
    {
        path: "/comment",
        meta: {
            title: "评论管理",
            position: "sidebar",
            icon: "fa-comments"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/comment/index`))
    },
    {
        path: "/setting",
        meta: {
            title: "系统设置",
            position: "sidebar",
            icon: "fa-cogs"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/setting/index`))
    },
    {
        path: "/login",
        meta: {
            title: "登陆"
        },
        layout: "fullpage",
        component: asyncComponent(() => import(`@/pages/login/index`))
    },
    /* {
        layout: "fullpage",
        meta: {
            title: "404"
        },
        component: asyncComponent(() => import(`@/pages/noMatch`))
    } */
];

export default routes;
