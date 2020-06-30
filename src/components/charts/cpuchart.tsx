import * as React from 'react';
import { useEffect, useState } from 'react';
import { Chart } from '@antv/g2';
import { Button } from 'antd';
// import Form from '@rjsf/antd';

const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
];

let chart: Chart;
export default function CPUInfoComponent() {

    useEffect(() => {
        chart = new Chart({
            container: 'c1', // 指定图表容器 ID
            autoFit: true,
            width: 300, // 指定图表宽度
            height: 300, // 指定图表高度
            renderer: "svg"
        });

        // Step 2: 载入数据源
        chart.data(data);
        chart.scale({
            year: {
                range: [0, 1],
            },
            value: {
                min: 0,
                nice: true,
            },
        });
        // Step 3: 创建图形语法，绘制柱状图
        chart.line().position('year*value').label('value');
        chart.point().position('year*value');


        // Step 4: 渲染图表
        chart.render();
        setInterval(() => {
            const year = (parseInt(data[data.length - 1].year) + 1).toString();
            data.push({ year: year, value: 10 })
            chart.changeData(data);
        }, 1000);
    })
    return (

        <div id="c1">
        </div>
    )
}