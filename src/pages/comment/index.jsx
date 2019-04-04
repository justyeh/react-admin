import React, { Component } from "react";
import { Table, Tag, message, Input, Button, Divider } from "antd";
import Tab from "@/components/Tab";
import Page from "@/components/Page";
import http from "@/libs/http";
import { dateFormat } from "@/libs/utils";

const Search = Input.Search;

const tabList = [{ value: 0, label: "未读" }, { value: 1, label: "已读" }];

const commentColumns = [
    {
        title: "评论人",
        dataIndex: "name",
        key: "name",
        align: "center",
        width: 120
    },
    {
        title: "评论内容",
        dataIndex: "content",
        key: "content",
        align: "left"
    },
    {
        title: "对应的文章",
        dataIndex: "postTitle",
        key: "tagList",
        align: "left",
        width: 300,
        render: (text, record) => <a href={`/post/${record.postId}`}>{text}</a>
    },
    {
        title: "发表时间",
        dataIndex: "updated_at",
        key: "updated_at",
        align: "center",
        width: 160,
        render: updated_at => (
            <span>{dateFormat(updated_at, "yyyy/MM/dd hh:mm:ss")}</span>
        )
    },
    {
        title: "操作",
        dataIndex: "handle",
        key: "handle",
        width: 180,
        fixed: "right",
        align: "center",
        render: (text, record, index) => {
            return (
                <div className="handle">
                    {record.is_read === 0 ? (
                        <span>
                            <a
                                href="javascript:;"
                                onClick={() => this.updateComentRead(index)}
                            >
                                设置已读
                            </a>
                            <Divider type="vertical" />
                        </span>
                    ) : null}

                    <a
                        href="javascript:;"
                        onClick={() => this.updateComentVisible(index)}
                    >
                        {record.is_show === 0 ? "显示" : "隐藏"}
                    </a>
                    <Divider type="vertical" />
                    <a
                        href="javascript:;"
                        onClick={() => this.deleteComment(index)}
                    >
                        删除
                    </a>
                </div>
            );
        }
    }
];

export default class comment extends Component {
    constructor(props) {
        super();
        this.state = {
            isRead: tabList[0].value,
            keyword: "",
            commentList: [],
            page: {
                pageIndex: 1,
                pageSize: 20,
                total: 0
            },
            tableLoading: false
        };
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
            this.setState({
                commentList: res.data.list,
                page
            });
        } else {
            message.error("获取Comment列表失败");
        }
        this.setState({
            tableLoading: false
        });
    }

    updateComentRead = () => {};

    updateComentVisible = index => {};

    deleteComment = index => {};

    render() {
        return (
            <div className="comment-list">
                <Tab
                    tabs={tabList}
                    value={this.state.isRead}
                    onTabClick={tabData => this.handleTabClick(tabData)}
                />
                <div className="container">
                    <Table
                        dataSource={this.state.commentList}
                        columns={commentColumns}
                        loading={this.state.tableLoading}
                        scroll={{ x: 1000 }}
                    />
                </div>
                <div className="container">
                    <Page
                        {...this.state.page}
                        onChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}
