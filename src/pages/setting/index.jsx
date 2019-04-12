import React, { Component } from "react";
import { Button } from "antd";
import { storage } from "@/libs/utils";
import "./setting.less";

export default class Setting extends Component {
    render() {
        let token = storage.get("token");
        return (
            <div className="setting-page">
                <div className="container">
                    <Button
                        type="primary"
                        size="large"
                        target="_blank"
                        href={`/api/setting/backup?token=${token}`}
                    >
                        导出markdown文件
                    </Button>
                    <div className="tip">
                        <p>将文章导出为单独的markdown文件</p>
                    </div>
                </div>
            </div>
        );
    }
}
