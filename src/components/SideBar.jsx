import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import routes from "@/router/";


export default class Sidebar extends Component {
  render() {
    return (
        <div className="sidebar">
            <div className="site-name">
                博客后台管理系统
            </div>
            <ul>
                {routes.filter(item=>item.meta.position === 'sidebar').map(item=>{
                    return  (
                        <li key={item.path}>
                        <NavLink to={item.path}>
                            <i className={'fa ' + item.meta.icon}></i>
                            <span>{item.meta.title}</span>
                        </NavLink>
                    </li>
                    )
                })}
            </ul>
        </div>
    );
  }
}
