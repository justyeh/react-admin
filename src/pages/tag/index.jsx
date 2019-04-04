import React, { Component } from "react";
import { Table, message, Divider, Input, Button, Icon, Modal } from "antd";
import http from "@/libs/http";
import "./tag.less";

const confirm = Modal.confirm;

const tagColumns = [
    {
        title: "名称",
        dataIndex: "name",
        key: "name",
        align: "center"
    },
    {
        title: "关联的文章",
        dataIndex: "postList",
        key: "postList",
        align: "left",
        render: postList => {
            return (
                <div className="post-list">
                    {postList.length == 0 ? (
                        <Icon type="frown" className="empty" title="empty" />
                    ) : (
                        postList.map(item => (
                            <div key={item.id}>
                                <a href={`/post/${item.id}`}>{item.title}</a>
                            </div>
                        ))
                    )}
                </div>
            );
        }
    },
    {
        title: "操作",
        dataIndex: "handle",
        key: "handle",
        width: 120,
        fixed: "right",
        align: "center",
        render: (text, record, index) => {
            return (
                <div className="handle">
                    <a href="javascript:;" onClick={() => this.editTag(index)}>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a
                        href="javascript:;"
                        onClick={() => this.deleteTag(index)}
                    >
                        删除
                    </a>
                </div>
            );
        }
    }
];

export default class Tag extends Component {
    constructor(props) {
        super();
        this.state = {
            tagList: [],
            tableLoading: false
        };
    }

    componentWillMount() {
        this.getTagList();
    }

    async getTagList() {
        this.setState({
            tableLoading: true
        });
        let res = await http.get("/api/tag/list");
        if (res) {
            this.setState({
                tagList: res.data
            });
        } else {
            message.error("获取Tag列表失败");
        }
        this.setState({
            tableLoading: false
        });
    }

    editTag = index => {};

    deleteTag = index => {
        confirm({
            title: "确认删除该条数据？",
            onOk() {}
        });
    };

    render() {
        return (
            <div className="post-list">
                <div className="container">
                    <h2 className="page-title">标签列表</h2>
                </div>
                <div className="container">
                    <Table
                        dataSource={this.state.tagList}
                        columns={tagColumns}
                        loading={this.state.tableLoading}
                        scroll={{ x: 1000 }}
                    />
                </div>
            </div>
        );
    }
}
