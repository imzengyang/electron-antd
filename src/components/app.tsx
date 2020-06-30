import * as React from 'react';
import { Layout, Select, Tabs, Descriptions,InputNumber, Button,Affix, Row } from 'antd';
import ListAppsComponents from './android/apps';
import ListDeviceInfoComponent from './android/deviceInfo';
import AboutComponent from './about';
import CPUInfoComponent from './charts/cpuchart';

const { Sider } = Layout;
const { Content } = Layout;
const { TabPane } = Tabs;

export default class AppComponent extends React.Component {

    render() {
        return (
            <Layout style={{ height: "100vh" }}>
                <Sider width={256} theme="light" style={{padding:6}} >
                    <ListAppsComponents />
                    <Tabs size="small" type="card">
                        <TabPane tab="设备" key="1">
                            <ListDeviceInfoComponent />
                        </TabPane>
                        <TabPane tab="设置" key="2">
                            <Descriptions bordered size="small">
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
                            <AboutComponent />
                        </TabPane>
                    </Tabs>
                    
                        
                    
                </Sider>
                <Content>
                    <Layout style={{height:300,padding:10}}>
                        <CPUInfoComponent />
                    </Layout>
                </Content>
            </Layout>
        )
    }
}
