import * as React from 'react';
import { Descriptions } from 'antd'
import { ADB } from "../../android/tools/androiddevice";
import { totalmem } from 'os';

export default function ListDeviceInfoComponent() {
    const adb = new ADB(ADB.listDevices()[0]);
    const phoneBand = adb.getPhoneBand()
    const sdkVersion = adb.getSDKVersion();
    const androidVersion = adb.getAndroidVersion();
    const wmSize = adb.getWMSize();
    const cpuAbi = adb.getCPUAbi();
    const totalmem = adb.getTotalMemo();
    const cpuModel = adb.getCPUModel();
    return (
        <Descriptions size="small" bordered column={1} >
            <Descriptions.Item label="设备">{phoneBand}</Descriptions.Item>
            <Descriptions.Item label="Android版本">{androidVersion}</Descriptions.Item>
            <Descriptions.Item label="SDK版本">{sdkVersion}</Descriptions.Item>
            <Descriptions.Item label="CPU型号">{cpuModel}</Descriptions.Item>
            <Descriptions.Item label="CPU类型">{cpuAbi}</Descriptions.Item>

            <Descriptions.Item label="内存">{totalmem}</Descriptions.Item>
            <Descriptions.Item label="分辨率">{wmSize}</Descriptions.Item>
        </Descriptions>
    );
}