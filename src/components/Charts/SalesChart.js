import React from "react";
import {
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Bar,
	ResponsiveContainer,
} from "recharts";
import "./Charts.css";

const SalesChart = ({ data }) => {
	// 기본 데이터 (데이터가 없을 경우 사용)
	const defaultData = [
		{ name: "1월", 매출: 200000, 매입: 120000 },
		{ name: "2월", 매출: 220000, 매입: 130000 },
		{ name: "3월", 매출: 250000, 매입: 140000 },
		{ name: "4월", 매출: 280000, 매입: 150000 },
		{ name: "5월", 매출: 300000, 매입: 160000 },
		{ name: "6월", 매출: 320000, 매입: 170000 },
	];

	const chartData = data || defaultData;

	return (
		<div className="chart-container">
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
					}}
					layout="horizontal"
					barCategoryGap={10}
					barGap={0}>
					<CartesianGrid
						strokeDasharray="3 3"
						horizontal={true}
						vertical={false}
					/>
					<XAxis
						dataKey="name"
						axisLine={{ stroke: "#E0E0E0" }}
						tickLine={false}
						tick={{ fill: "#333333", fontSize: 12 }}
						height={50}
						textAnchor="middle"
					/>
					<YAxis
						axisLine={{ stroke: "#E0E0E0" }}
						tickLine={false}
						tick={{ fill: "#333333", fontSize: 12 }}
						width={60}
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
						wrapperStyle={{ paddingTop: "10px" }}
					/>
					<Bar
						dataKey="매출"
						fill="#2196F3"
						radius={[4, 4, 0, 0]}
						barSize={30}
						isAnimationActive={false}
					/>
					<Bar
						dataKey="매입"
						fill="#F44336"
						radius={[4, 4, 0, 0]}
						barSize={30}
						isAnimationActive={false}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default SalesChart;
