import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";

import * as THREE from "three";
import "./style.less";
import http from "@/libs/http";
import { storage, getQueryVariable } from "@/libs/utils";

const FormItem = Form.Item;

let SEPARATION = 100;
let AMOUNTX = 100;
let AMOUNTY = 70;

let container, camera, scene, renderer;

let particles,
    particle,
    count = 0;

let mouseX = 85,
    mouseY = -342;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: !!storage.get("token"),
            submitLoading: false
        };
        if (this.state.isLogin) {
            this.enterApp();
        }
    }

    componentDidMount() {
        container = document.getElementById("bg");
        this.init();
        this.animate();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    enterApp() {
        let search = this.props.location.search;
        this.props.history.replace(getQueryVariable(search, "redirect") || "/");
    }

    init() {
        camera = new THREE.PerspectiveCamera(
            120,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );
        camera.position.z = 1000;
        scene = new THREE.Scene();
        particles = [];
        var PI2 = Math.PI * 2;
        var material = new THREE.ParticleCanvasMaterial({
            color: 0xe1e1e1,
            program: function(context) {
                context.beginPath();
                context.arc(0, 0, 0.6, 0, PI2, true);
                context.fill();
            }
        });
        var i = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++] = new THREE.Particle(material);
                particle.position.x =
                    ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
                particle.position.z =
                    iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
                scene.add(particle);
            }
        }
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        window.addEventListener("resize", this.onWindowResize, false);
    }

    onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }
    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.draw();
    }
    draw() {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        var i = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++];
                particle.position.y =
                    Math.sin((ix + count) * 0.3) * 50 +
                    Math.sin((iy + count) * 0.5) * 50;
                particle.scale.x = particle.scale.y =
                    (Math.sin((ix + count) * 0.3) + 1) * 2 +
                    (Math.sin((iy + count) * 0.5) + 1) * 2;
            }
        }
        renderer.render(scene, camera);
        count += 0.1;
    }

    handleFormSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return false;
            }
            this.setState({
                submitLoading: true
            });
            let res = await http.post("/api/user/login", values);
            this.setState({
                submitLoading: false
            });

            if (res) {
                storage.set("token", res.data.token);
                this.enterApp();
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-page">
                <div id="bg" className="bg" />
                <div className="app">
                    <h2>Justyeh's Blog</h2>
                    <Form className="form" onSubmit={this.handleFormSubmit}>
                        <FormItem>
                            {getFieldDecorator("email", {
                                rules: [
                                    /*  {
                                type: 'email',
                                message: '请输入正确的邮箱地址'
                            }, */
                                    {
                                        required: true,
                                        message: "请输入邮箱地址"
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="user" />}
                                    placeholder="请输入登录邮箱"
                                    autoComplete="off"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator("password", {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入密码"
                                    }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="lock" />}
                                    type="password"
                                    placeholder="请输入密码"
                                    autoComplete="off"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={this.state.submitLoading}
                                block
                            >
                                Sign in
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const Login = Form.create({})(LoginForm);

export default Login;
