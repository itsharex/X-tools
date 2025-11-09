import React from 'react';
import {ConfigProvider, Splitter} from "antd";

export const App: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Splitter: {
                        splitBarDraggableSize: 0,
                    },
                },
            }}
        >
            <Splitter style={{height: '100vh'}}>
                <Splitter.Panel defaultSize={320} min={80}>
                    <div className={'top-bar'} style={{paddingLeft: 80}}>X-tools</div>
                </Splitter.Panel>
                <Splitter.Panel min={240}>
                    <div className={'top-bar'}>text</div>
                </Splitter.Panel>
                <Splitter.Panel defaultSize={320} min={80}>
                    <div className={'top-bar'}>text</div>
                </Splitter.Panel>
            </Splitter>
        </ConfigProvider>
    );
};
