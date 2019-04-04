import React, { Component } from "react";
import { Button } from "antd";
import "./setting.less";

export default class Setting extends Component {
    constructor(props) {
        super();
    }
    render() {
        return (
            <div className="setting-page">
                <div className="container">
                    <Button type="primary" size="large">
                        导出markdown文件
                    </Button>
                    <div className="tip">
                        <p>将文章导出为单独的markdown文件</p>
                    </div>
                </div>
                <div className="container">
                    <Button type="primary" size="large">
                        导出数据库
                    </Button>
                    <div className="tip">
                        <p>将数据库导出为sql文件</p>
                    </div>
                </div>
            </div>
        );
    }
}
