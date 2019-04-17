import React, { Component } from "react";
import headImage from "@/assets/image/head.jpg";
import { withRouter } from "react-router-dom";
import { storage } from "@/libs/utils";
import { Modal } from "antd";

const confirm = Modal.confirm;

class Header extends Component {
    handleLogout = () => {
        confirm({
            title: "是否确定退出登录？",
            onOk: () => {
                storage.remove("token");
                this.props.history.push("/login");
            }
        });
    };
    render() {
        return (
            <header className="header">
                <div>
                    <a href="http://www.justyeh.top">返回前台</a>
                </div>
                <div className="user">
                    <img src={headImage} alt="" />
                    <div>
                        <p>叶文祥</p>
                        <p className="logout" onClick={this.handleLogout}>
                            退出
                        </p>
                    </div>
                </div>
            </header>
        );
    }
}

export default withRouter(Header);
