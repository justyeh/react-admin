import React, { Component } from "react";
import {
    Form,
    Icon,
    Input,
    Button,
    Upload,
    AutoComplete,
    Radio,
    Spin,
    Tag,
    message
} from "antd";

import MarkdownEditor from "@/components/MarkdownEditor";
import http from "@/libs/http";
import { getQueryVariable } from "@/libs/utils";
import "./post.less";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const Option = AutoComplete.Option;

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLoading: false,
            tag: [],
            tagList: [],
            uploadPreview: "",
            markdown: "",
            autoCompleteValue: ""
        };
        this.postId = getQueryVariable(this.props.location.search, "id");
        this.editorRef = React.createRef();
    }

    async componentWillMount() {
        if (!this.postId) {
            return;
        }
        this.setState({
            pageLoading: true
        });
        let res = await http.get(`/api/post/detail/${this.postId}`);
        if (res) {
            this.props.form.setFieldsValue({
                title: res.data.title,
                summary: res.data.summary,
                allow_comment: res.data.allow_comment,
                status: res.data.status
            });
            this.setState({
                tag: res.data.tagList,
                uploadPreview: res.data.poster,
                markdown: res.data.markdown
            });
        } else {
            message.error("获取Post详情失败");
        }
        this.setState({
            pageLoading: false
        });
    }

    deleteImage = e => {
        e.stopPropagation();
        this.setState({
            uploadPreview: ""
        });
    };

    handleTagSearch = async val => {
        let tagList = [];

        let res = await http.get(`/api/tag/search?name=${val}`);
        if (
            res &&
            this.state.tag.filter(item => item.name === val).length === 0
        ) {
            tagList = res.data.length
                ? res.data
                : [{ id: -1, name: `将${val}添加到标签列表中` }];
        }
        this.setState({
            autoCompleteValue: val,
            tagList
        });
    };

    handleTagSelect = async val => {
        val = parseInt(val);

        let tag = this.state.tag.concat(
            val === -1
                ? [{ id: -1, name: this.state.autoCompleteValue }]
                : this.state.tagList.filter(item => item.id === parseInt(val))
        );
        this.setState({
            tag,
            autoCompleteValue: "",
            tagList: []
        });
    };

    handleTagClose(id) {
        let tag = this.state.tag.filter(item => item.id !== id);
        this.setState({ tag });
    }

    handleFormSubmit = () => {
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return false;
            }
            this.setState({
                pageLoading: true
            });
            let formValue = this.props.form.getFieldsValue();

            var formData = new FormData();
            formData.append("title", formValue.title);

            formData.append(
                "poster",
                formValue.poster
                    ? formValue.poster.file
                    : this.state.uploadPreview
            );
            formData.append("tag", JSON.stringify(this.state.tag));
            formData.append("summary", formValue.summary);
            formData.append("markdown", this.editorRef.current.getValue());
            formData.append("allow_comment", formValue.allow_comment);
            formData.append("status", formValue.status);

            try {
                let url = "";
                if (this.postId) {
                    url = "/api/post/update";
                    formData.append("id", this.postId);
                } else {
                    url = "/api/post/add";
                }
                let res = await http({
                    method: "POST",
                    url,
                    headers: {
                        "Content-type": "multipart/form-data"
                    },
                    data: formData
                });
                if (res) {
                    this.props.history.goBack();
                }

                this.setState({
                    pageLoading: false
                });
            } catch (error) {
                console.log(error);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const beforeUpload = file => {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error("Image must smaller than 2MB!");
            } else {
                this.setState({
                    uploadFile: file
                });
            }

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                this.setState({
                    uploadPreview: reader.result
                });
            });
            reader.readAsDataURL(file);

            return false;
        };

        let Title = getFieldDecorator("title", {
            rules: [
                {
                    required: true,
                    message: "请输入标题"
                }
            ]
        })(<Input autoComplete="off" />);

        let Poster = getFieldDecorator("poster")(
            <Upload.Dragger
                name="logo"
                listType="picture"
                className="custom-ant-upload"
                showUploadList={false}
                accept="image/png,image/jpg,image/jpeg"
                beforeUpload={beforeUpload}
            >
                {this.state.uploadPreview && (
                    <img
                        src={this.state.uploadPreview}
                        className="preview"
                        alt="poster"
                    />
                )}
                <div className="delete">
                    <Icon type="delete" onClick={this.deleteImage} />
                </div>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                    点击或者拖拽文件到此区域进行上传
                </p>
            </Upload.Dragger>
        );

        let Summary = getFieldDecorator("summary")(
            <TextArea
                autoComplete="off"
                autosize={{ minRows: 3, maxRows: 5 }}
            />
        );

        let Comment = getFieldDecorator("allow_comment", { initialValue: 1 })(
            <RadioGroup>
                <Radio value={1}>开启</Radio>
                <Radio value={0}>关闭</Radio>
            </RadioGroup>
        );

        let Status = getFieldDecorator("status", { initialValue: "published" })(
            <RadioGroup>
                <Radio value="published">发布</Radio>
                <Radio value="draft">草稿</Radio>
                <Radio value="offline">下线</Radio>
            </RadioGroup>
        );

        const formItemLayout = {
            labelCol: {
                span: 2
            },
            wrapperCol: {
                span: 20
            }
        };

        return (
            <div className="post-form-page">
                <h2 className="page-title container">
                    {!!this.postId ? "Edit" : "Add"} Blog
                </h2>
                <div className="container">
                    <Spin spinning={this.state.pageLoading}>
                        <Form {...formItemLayout}>
                            <FormItem label="标题">{Title}</FormItem>
                            <FormItem label="封面">{Poster}</FormItem>
                            <FormItem label="摘要">{Summary}</FormItem>
                            <FormItem label="标签">
                                {this.state.tag.map(item => {
                                    return (
                                        <Tag
                                            closable
                                            key={item.id + item.name}
                                            onClose={() =>
                                                this.handleTagClose(item.id)
                                            }
                                        >
                                            {item.name}
                                        </Tag>
                                    );
                                })}
                                <AutoComplete
                                    onSelect={this.handleTagSelect}
                                    onSearch={this.handleTagSearch}
                                    placeholder="input tag here"
                                >
                                    {this.state.tagList.map(item => {
                                        return (
                                            <Option key={item.id}>
                                                {item.name}
                                            </Option>
                                        );
                                    })}
                                </AutoComplete>
                            </FormItem>
                            <FormItem label="正文">
                                <MarkdownEditor
                                    value={this.state.markdown}
                                    onSave={this.handleFormSubmit}
                                    test="11"
                                    ref={this.editorRef}
                                />
                            </FormItem>
                            <FormItem label="评论">{Comment}</FormItem>
                            <FormItem label="状态">{Status}</FormItem>
                            <FormItem wrapperCol={{ offset: 2 }}>
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    onClick={this.handleFormSubmit}
                                >
                                    保存
                                </Button>
                                <Button
                                    htmlType="button"
                                    onClick={() => {
                                        this.props.history.goBack();
                                    }}
                                >
                                    取消
                                </Button>
                            </FormItem>
                        </Form>
                    </Spin>
                </div>
            </div>
        );
    }
}

const form = Form.create({})(PostForm);

export default form;
