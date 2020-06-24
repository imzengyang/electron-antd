import * as React from 'react';
import { Layout, Select, Tabs, Descriptions,InputNumber } from 'antd';

const { Sider } = Layout;
const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

export default class AppComponent extends React.Component {

    render() {
        return (
            <Layout style={{ height: "100vh" }}>
                <Sider width={300} theme="light" style={{padding:6}} >
                    <Select defaultValue="no devices" style={{ width: '100%' }}>
                        <Option value="no devices">请连接设备</Option>
                    </Select>
                    <Tabs size="small" type="card">
                        <TabPane tab="设备" key="1">

                        </TabPane>
                        <TabPane tab="设置" key="2">
                            <Descriptions bordered>
                                <Descriptions.Item label="FPS(>=)" span={3}>
                                    <InputNumber size="small" min={18} max={144} defaultValue={18}></InputNumber>
                                    <InputNumber size="small" min={18} max={144} defaultValue={25}></InputNumber>
                                </Descriptions.Item>
                                <Descriptions.Item label="FrameTime(>=)" span={3}>
                                    <InputNumber size="small" min={18} max={144} defaultValue={18} 
                                    formatter={value=>`${value} ms`}></InputNumber>
                                   
                                </Descriptions.Item>
                                <Descriptions.Item label="CPU(>=)" span={3}>
                                    <InputNumber size="small" min={30} max={60} defaultValue={30}
                                    formatter={value=>`${value} %`}></InputNumber>
                                    <InputNumber size="small" min={60} max={100} defaultValue={60}
                                    formatter={value=>`${value} %`}></InputNumber>
                                </Descriptions.Item>
                                <Descriptions.Item label="NetWorkFlow(=)" span={3}>
                                    <InputNumber size="small" min={1} max={60} defaultValue={10} 
                                    formatter={value=>`${value} 分钟`}></InputNumber>
                                   
                                </Descriptions.Item>
                            </Descriptions>
                        </TabPane>
                        <TabPane tab="关于" key="3">
                            <Descriptions title="PerfCat 性能猫" bordered>
                                <Descriptions.Item label="版本" span={3}>V2020.07.01</Descriptions.Item>
                                <Descriptions.Item label="帮助" span={3}>http://www.PerfCat.com
                                </Descriptions.Item>
                            </Descriptions>
                        </TabPane>
                    </Tabs>
                </Sider>
                <Content>

                </Content>
            </Layout>
        )
    }
}
