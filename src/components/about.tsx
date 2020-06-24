import * as React from 'react';
import { Descriptions, Button } from 'antd';

export default function AboutComponent() {
    return (
        <>
        <Descriptions bordered  size="small">
            <Descriptions.Item label="版本" span={3}>V2020.07.01</Descriptions.Item>
            <Descriptions.Item label="帮助" span={3}>http://www.PerfCat.com
            </Descriptions.Item>
        </Descriptions>
        <Button type="ghost" block style={{marginTop:4}}>检查更新</Button>
        </>
    )
}