import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import "./Charts.css";

const ProfitChart = ({ data }) => {
	// 기본 데이터 (데이터가 없을 경우 사용)
	const defaultData = [
		{ name: "1월", 수익: 150000, 비용: 90000 },
		{ name: "2월", 수익: 170000, 비용: 95000 },
		{ name: "3월", 수익: 180000, 비용: 100000 },
		{ name: "4월", 수익: 190000, 비용: 110000 },
		{ name: "5월", 수익: 200000, 비용: 115000 },
		{ name: "6월", 수익: 210000, 비용: 120000 },
	];

	const chartData = data || defaultData;

	return (
		<ResponsiveContainer
			width="100%"
			height={350}>
			<BarChart
				data={chartData}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 30,
				}}>
				<CartesianGrid
					strokeDasharray="3 3"
					vertical={false}
				/>
				<XAxis
					dataKey="name"
					axisLine={{ stroke: "#E0E0E0" }}
					tickLine={false}
					tick={{ fill: "#333333", fontSize: 12 }}
				/>
				<YAxis
					axisLine={{ stroke: "#E0E0E0" }}
					tickLine={false}
					tick={{ fill: "#333333", fontSize: 12 }}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "white",
						border: "1px solid #E0E0E0",
						borderRadius: "4px",
						boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
					}}
				/>
				<Legend
					verticalAlign="bottom"
					height={36}
					iconType="circle"
					iconSize={10}
				/>
				<Bar
					dataKey="수익"
					fill="#4CAF50"
					radius={[4, 4, 0, 0]}
					barSize={30}
				/>
				<Bar
					dataKey="비용"
					fill="#FF9800"
					radius={[4, 4, 0, 0]}
					barSize={30}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ProfitChart;
