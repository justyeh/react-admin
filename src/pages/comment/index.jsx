import React, { Component } from "react";
import { Table, message, Button, Divider, Modal } from "antd";
import Tab from "@/components/Tab";
import Page from "@/components/Page";
import http from "@/libs/http";
import { dateFormat } from "@/libs/utils";

const tabList = [{ value: 0, label: "未读" }, { value: 1, label: "已读" }];

const confirm = Modal.confirm;

export default class comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRead: tabList[0].value,
            keyword: "",
            commentList: [],
            page: {
                pageIndex: 1,
                pageSize: 20,
                total: 0
            },
            tableLoading: false,
            selectedRowIds: []
        };
        this.commentColumns = [
            {
                title: "评论人",
                dataIndex: "name",
                align: "center",
                width: 100
            },
            {
                title: "联系方式",
                dataIndex: "contacts",
                align: "center",
                width: 140
            },
            {
                title: "评论内容",
                dataIndex: "content",
                align: "left"
            },
            {
                title: "对应的文章",
                dataIndex: "postTitle",
                align: "left",
                width: 300,
                render: (text, record) => (
                    <a href={`http://www.justyeh.top/post/${record.postId}`}>
                        {text}
                    </a>
                )
            },
            {
                title: "发表时间",
                dataIndex: "updated_at",
                align: "center",
                width: 160,
                render: updated_at => (
                    <span>{dateFormat(updated_at, "yyyy/MM/dd hh:mm:ss")}</span>
                )
            },
            {
                title: "操作",
                dataIndex: "handle",
                width: 180,
                fixed: "right",
                align: "center",
                render: (text, record) => {
                    return (
                        <div className="handle">
                            {record.is_read === 0 ? (
                                <span>
                                    <button
                                        onClick={() =>
                                            this.updateCommentRead([record.id])
                                        }
                                    >
                                        设置已读
                                    </button>
                                    <Divider type="vertical" />
                                </span>
                            ) : null}
                            <button
                                onClick={() => this.deleteComments([record.id])}
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
        this.getCommentList();
    }

    handleTabClick = val => {
        let page = Object.assign({}, this.state.page, {
            pageIndex: 1
        });
        this.setState(
            {
                isRead: val,
                page
            },
            this.getCommentList
        );
    };

    handlePageChange = (pageIndex, pageSize) => {
        let page = Object.assign({}, this.state.page, {
            pageIndex,
            pageSize
        });
        this.setState(
            {
                page
            },
            this.getCommentList
        );
    };

    async getCommentList() {
        this.setState({
            tableLoading: true
        });
        let res = await http.get("/api/comment/list", {
            params: {
                isRead: this.state.isRead,
                pageIndex: this.state.page.pageIndex,
                pageSize: this.state.page.pageSize
            }
        });
        if (res) {
            let page = Object.assign({}, this.state.page, {
                total: res.data.total
            });
            this.setState(
                {
                    commentList: res.data.list,
                    selectedRowIds: [],
                    page
                },
                () => {
                    document.querySelector(".app").scrollTop = 0;
                }
            );
        } else {
            message.error("获取Comment列表失败");
        }
        this.setState({
            tableLoading: false
        });
    }

    updateCommentRead = async ids => {
        let res = await http.post("/api/comment/setRead", {
            ids
        });
        if (res) {
            this.getCommentList();
        }
    };

    deleteComments = async ids => {
        confirm({
            title: "确认删除选中的数据？",
            onOk: async () => {
                let res = await http.post("/api/comment/delete", {
                    ids
                });
                if (res) {
                    let page = this.state.page;
                    let isPageIndexReduce =
                        ids.length === this.state.commentList.length &&
                        this.state.page.pageIndex - 1 > 0;
                    if (isPageIndexReduce) {
                        page.pageIndex = page.pageIndex - 1;
                    }
                    this.setState(
                        {
                            page
                        },
                        this.getCommentList
                    );
                }
            }
        });
    };

    render() {
        const rowSelection = {
            columnWidth: 40,
            onChange: selectedRowKeys => {
                this.setState({
                    selectedRowIds: selectedRowKeys
                });
            },
            selectedRowKeys: this.state.selectedRowIds
        };
        return (
            <div className="comment-list">
                <Tab
                    tabs={tabList}
                    value={this.state.isRead}
                    onTabClick={tabData => this.handleTabClick(tabData)}
                />
                <h2 className="page-title container">评论列表</h2>
                <div className="container">
                    <Table
                        rowKey={record => record.id}
                        rowSelection={rowSelection}
                        dataSource={this.state.commentList}
                        columns={this.commentColumns}
                        loading={this.state.tableLoading}
                        scroll={{ x: 1200 }}
                    />
                </div>
                <div className="container flex-between">
                    <div>
                        <Button
                            onClick={() =>
                                this.deleteComments(this.state.selectedRowIds)
                            }
                            disabled={this.state.selectedRowIds.length === 0}
                        >
                            删除选中
                        </Button>
                        <Button
                            onClick={() =>
                                this.updateCommentRead(
                                    this.state.selectedRowIds
                                )
                            }
                            disabled={this.state.selectedRowIds.length === 0}
                        >
                            设置已读
                        </Button>
                    </div>
                    <Page
                        {...this.state.page}
                        onChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}
