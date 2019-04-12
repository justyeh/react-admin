import React, { Component } from "react";
import { Table, Tag, message, Input, Button, Modal } from "antd";
import Tab from "@/components/Tab";
import Page from "@/components/Page";
import http from "@/libs/http";
import "./post.less";

const confirm = Modal.confirm;
const Search = Input.Search;

const tabList = [
    { value: "published", label: "已发布" },
    { value: "draft", label: "草稿" },
    { value: "offline", label: "被下线" }
];

export default class Post extends Component {
    constructor(props) {
        super();
        this.state = {
            status: tabList[0].value,
            keyword: "",
            postList: [],
            page: {
                pageIndex: 1,
                pageSize: 10,
                total: 0
            },
            tableLoading: false
        };
        this.postColumns = [
            {
                title: "图片",
                dataIndex: "poster",
                align: "center",
                render: poster =>
                    poster ? (
                        <img src={poster} className="poster" alt="poster" />
                    ) : (
                        <div className="poster" />
                    )
            },
            {
                title: "标题",
                dataIndex: "title",
                align: "left",
                render: (text, record) => (
                    <a
                        href={`/post/${record.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {text}
                    </a>
                )
            },
            {
                title: "标签",
                dataIndex: "tagList",
                align: "center",
                render: tagList => (
                    <div>
                        {tagList.map(tag => {
                            return <Tag key={tag.id}>{tag.name}</Tag>;
                        })}
                    </div>
                )
            },
            {
                title: "操作",
                dataIndex: "handle",
                width: 100,
                fixed: "right",
                align: "center",
                render: (text, record, index) => {
                    return (
                        <div className="handle">
                            {record.status === "offline" ? (
                                <button onClick={() => this.deletePost(index)}>
                                    删除
                                </button>
                            ) : (
                                <button
                                    onClick={() => this.editPost(record.id)}
                                >
                                    编辑
                                </button>
                            )}
                        </div>
                    );
                }
            }
        ];
    }

    componentWillMount() {
        this.getPostList();
    }

    handleSearch = val => {
        this.setState(
            {
                keyword: val
            },
            this.getPostList
        );
    };

    handleTabClick = val => {
        let page = Object.assign({}, this.state.page, {
            pageIndex: 1
        });
        this.setState(
            {
                status: val,
                keyword: "",
                page
            },
            this.getPostList
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
            this.getPostList
        );
    };

    async getPostList() {
        this.setState({
            tableLoading: true
        });
        let res = await http.get("/api/post/list", {
            params: {
                status: this.state.status,
                keyword: this.state.keyword,
                pageIndex: this.state.page.pageIndex,
                pageSize: this.state.page.pageSize
            }
        });
        if (res) {
            let page = Object.assign({}, this.state.page, {
                total: res.data.total
            });
            this.setState({
                postList: res.data.list,
                page
            });
        } else {
            message.error("获取Post列表失败");
        }
        this.setState({
            tableLoading: false
        });
    }

    addPost = () => {
        this.props.history.push("/post-form");
    };

    editPost = id => {
        this.props.history.push(`/post-form?id=${id}`);
    };

    deletePost = index => {
        confirm({
            title: "确定删除该文章吗？",
            onOk: async () => {
                let res = await http.post("/api/post/delete", {
                    id: this.state.postList[index].id
                });
                if (res) {
                    let page = this.state.page;
                    if (this.state.commentList.length === 1) {
                        page.pageIndex -= page.pageIndex;
                    }
                    this.setState(
                        {
                            page
                        },
                        this.getPostList
                    );
                }
            }
        });
    };

    render() {
        return (
            <div className="post-list">
                <Tab
                    tabs={tabList}
                    value={this.state.status}
                    onTabClick={tabData => this.handleTabClick(tabData)}
                />
                <div className="container filter">
                    <Search
                        placeholder="input search text"
                        enterButton="搜索"
                        className="search"
                        value={this.state.keyword}
                        onChange={e =>
                            this.setState({ keyword: e.target.value })
                        }
                        onSearch={this.handleSearch}
                    />
                    <Button type="primary" onClick={this.addPost}>
                        新增
                    </Button>
                </div>
                <h2 className="page-title container">博客列表</h2>
                <div className="container">
                    <Table
                        rowKey={record => record.id}
                        dataSource={this.state.postList}
                        columns={this.postColumns}
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
