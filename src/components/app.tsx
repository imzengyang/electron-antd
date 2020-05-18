import * as React from 'react';
import { Layout, Button, message } from 'antd';

export default class AppComponent extends React.Component {

    info() {
        message.info('this is a message')
    }

    render() {
        return (
            <Layout>
                <Button onClick={() => this.info()} >Click</Button>
            </Layout>
        )
    }
}
