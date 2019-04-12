import asyncComponent from "@/components/AsyncComponent";

const routes = [
    {
        path: "/post",
        meta: {
            title: "博客管理",
            position: "sidebar",
            icon: "fa-book",
            highlight: "/post"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/post/index`))
    },
    {
        path: "/post-form",
        meta: {
            title: "博客管理",
            highlight: "/post"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/post/form`))
    },
    {
        path: "/tag",
        meta: {
            title: "标签管理",
            position: "sidebar",
            icon: "fa-tags",
            highlight: "/tag"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/tag/index`))
    },
    {
        path: "/comment",
        meta: {
            title: "评论管理",
            position: "sidebar",
            icon: "fa-comments",
            highlight: "/comment"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/comment/index`))
    },
    {
        path: "/setting",
        meta: {
            title: "系统设置",
            position: "sidebar",
            icon: "fa-cogs",
            highlight: "/setting"
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
    {
        layout: "fullpage",
        key: 404,
        meta: {
            title: "404"
        },
        component: asyncComponent(() => import(`@/pages/noMatch`))
    }
];

export default routes;
