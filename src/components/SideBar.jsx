import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import routes from "@/router/";
import { basePath } from "@/appConfig";
import http from "@/libs/http";

export default class Sidebar extends Component {
    getClass = data => {
        let className = "";
        let activeRoute = routes.find(item => {
            return basePath + item.path === window.location.pathname;
        });
        if (activeRoute) {
            className =
                data.path === activeRoute.meta.highlight ? " active" : "";
        }
        return className;
    };
    async componentDidMount() {
        let res = await http.get("/api/comment/list", {
            params: {
                isRead: 0,
                pageIndex: 1,
                pageSize: 1
            }
        });
        if (res && res.data.total > 0) {
            let _badge = document.createElement("span");
            _badge.className = "badge";
            document
                .querySelectorAll(".sidebar ul li:nth-child(3)")[0]
                .append(_badge);
        }
    }
    render() {
        return (
            <div className="sidebar">
                <div className="site-name">博客后台管理系统</div>
                <ul>
                    {routes
                        .filter(item => item.meta.position === "sidebar")
                        .map(item => {
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={this.getClass(item)}
                                    >
                                        <i className={"fa " + item.meta.icon} />
                                        <span>{item.meta.title}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                </ul>
            </div>
        );
    }
}
