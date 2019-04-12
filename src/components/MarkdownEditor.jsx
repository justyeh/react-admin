import React, { Component } from "react";
import { Icon } from "antd";
import marked from "marked";
import hljs from "highlight.js";
import PropTypes from "prop-types";
import "@/assets/less/MarkdownEditor.less";

const CodeMirror = window.CodeMirror;

export default class MarkdownEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preview: false,
            fullscreen: false,
            sideMode: false,
            mdContent: props.value
        };
        this.editorRef = React.createRef();
    }

    componentWillMount() {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function(code) {
                return hljs.highlightAuto(code).value;
            }
        });
        window.addEventListener("keydown", this.onKeyDown, false);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown = e => {
        if (e.key === "Escape" && this.state.fullscreen) {
            this.setState({
                fullscreen: false
            });
        }
        if (e.key.toLowerCase() === "s" && e.ctrlKey) {
            e.preventDefault();
            if (typeof this.props.onSave === "function") {
                this.props.onSave();
            }
        }
    };

    componentDidMount() {
        this.editor = CodeMirror.fromTextArea(this.editorRef.current, {
            mode: "markdown",
            theme: "default"
        });
        this.editor.on("change", this.handleChange);
    }

    togglePreview = () => {
        let { preview, sideMode } = this.state;
        if (sideMode) {
            sideMode = false;
        }
        this.setState({
            preview: !preview,
            sideMode
        });
    };

    toggleFullscreen = () => {
        this.setState({
            fullscreen: !this.state.fullscreen
        });
    };

    toggleSideMode = () => {
        let { preview, sideMode } = this.state;
        if (preview) {
            preview = false;
        }
        this.setState({
            preview,
            sideMode: !sideMode
        });
    };

    handleChange = val => {
        if (this.state.preview || this.state.sideMode) {
            this.setState({
                mdContent: val.getValue()
            });
        }
    };

    render() {
        let { preview, fullscreen, sideMode, mdContent } = this.state;

        let markdownClass = ["markdown"];
        preview && markdownClass.push("preview");
        fullscreen && markdownClass.push("fullscreen");
        sideMode && markdownClass.push("side-mode");

        return (
            <div className={markdownClass.join(" ")}>
                <div
                    className={`${
                        preview || fullscreen || sideMode ? "active " : ""
                    }tabbar`}
                >
                    <div
                        title="预览"
                        className={preview ? "border" : ""}
                        onClick={this.togglePreview}
                    >
                        <Icon type="eye" />
                    </div>
                    <div
                        title={fullscreen ? "退出全屏" : "全屏"}
                        className={fullscreen ? "border" : ""}
                        onClick={this.toggleFullscreen}
                    >
                        <Icon
                            type={fullscreen ? "fullscreen-exit" : "fullscreen"}
                        />
                    </div>
                    <div
                        title="边写边看"
                        className={sideMode ? "border" : ""}
                        onClick={this.toggleSideMode}
                    >
                        <Icon type="minus-square" rotate={90} />
                    </div>
                </div>
                <div className="box">
                    <div className="editor">
                        <textarea
                            id="code"
                            ref={this.editorRef}
                            defaultValue={mdContent}
                        />
                    </div>
                    <div className="html">
                        <div
                            className="md"
                            dangerouslySetInnerHTML={{
                                __html: marked(mdContent)
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

MarkdownEditor.propTypes = {
    value: PropTypes.string.isRequired,
    onSave: PropTypes.func
};

MarkdownEditor.defaultProps = {
    value: ""
};
