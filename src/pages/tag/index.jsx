import React, { Component } from "react";
import { Table, message, Divider, Icon, Modal } from "antd";
import TagDialog from "./dialog";
import http from "@/libs/http";

const confirm = Modal.confirm;

export default class Tag extends Component {
    constructor(props) {
        super();
        this.state = {
            tagList: [],
            tableLoading: false,
            dialogVisible: false,
            tagForm: {}
        };

        this.tagColumns = [
            {
                title: "名称",
                dataIndex: "name",
                align: "center"
            },
            {
                title: "关联的文章",
                dataIndex: "postList",
                align: "left",
                render: postList => {
                    return (
                        <div className="post-list">
                            {postList.length === 0 ? (
                                <Icon
                                    type="frown"
                                    className="empty"
                                    title="empty"
                                    style={{ color: "#999", fontSize: " 20px" }}
                                />
                            ) : (
                                postList.map(item => (
                                    <div key={item.id}>
                                        <a href={`http://www.justyeh.top/post/${item.id}`} rel="noopener noreferrer" target="_blank">
                                            {item.title}
                                        </a>
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
                width: 120,
                fixed: "right",
                align: "center",
                render: (text, record, index) => {
                    return (
                        <div className="handle">
                            <button onClick={() => this.editTag(index)}>
                                编辑
                            </button>
                            <Divider type="vertical" />
                            <button
                                disabled={record.postList.length > 0}
                                onClick={() => this.deleteTag(index)}
                            >
                                删除
                            </button>
                        </div>
                    );
                }
            }
        ];
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
            res.data.forEach(item => {
                item.editable = false;
            });
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

    editTag = index => {
        let tag = this.state.tagList[index];
        this.setState({
            dialogVisible: true,
            tagForm: {
                id: tag.id,
                name: tag.name,
                index
            }
        });
    };

    updateTagOk = async values => {
        let { id, index } = this.state.tagForm;
        let res = await http.post("/api/tag/update", {
            id,
            ...values
        });
        if (res) {
            let tagList = this.state.tagList;
            tagList[index].name = values.name;
            this.setState({
                dialogVisible: false,
                tagList
            });
        }
    };

    deleteTag = index => {
        confirm({
            title: "确认删除该条数据？",
            onOk: async () => {
                let res = await http.post("/api/tag/delete", {
                    id: this.state.tagList[index].id
                });
                if (res) {
                    this.setState({
                        tagList: this.state.tagList.filter(
                            (item, itemIndex) => itemIndex !== index
                        )
                    });
                }
            }
        });
    };

    render() {
        return (
            <div className="post-list">
                <h2 className="page-title container">标签列表</h2>
                <div className="container">
                    <Table
                        rowKey={record => record.id}
                        dataSource={this.state.tagList}
                        columns={this.tagColumns}
                        loading={this.state.tableLoading}
                        scroll={{ x: 1000 }}
                    />
                </div>
                {this.state.dialogVisible && (
                    <TagDialog
                        visible={this.state.dialogVisible}
                        name={this.state.tagForm.name}
                        onOk={this.updateTagOk}
                        onCancel={() => {
                            this.setState({
                                dialogVisible: false
                            });
                        }}
                    />
                )}
            </div>
        );
    }
}
