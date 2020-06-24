import * as React from 'react';
import { Select, Button } from 'antd';
import { ADB } from '../../android/tools/androiddevice'
const { Option } = Select;

export default function ListAppsComponents() {
    const adb = new ADB(ADB.listDevices()[0]);
    // console.log(adb.listInstalledApp())
    const allApps = adb.listInstalledApp();
    
    return (
        <>
            <Select defaultValue="no devices" style={{ width: '100%', marginTop: 3, marginBottom: 6 }}>
                <Option value="no devices">请选择设备</Option>
            </Select>
            <Select defaultValue="no devices" showSearch allowClear style={{ width: '100%' }}>
                <Option value="no devices">请选择被测App</Option>
                {allApps.map((app, index) => (<Option key={index} value={app}>{app}</Option>))}
            </Select>
            <Button type="primary" block style={{ marginTop: 4, marginBottom: 4 }}>开始测试</Button>
        </>
    )
}