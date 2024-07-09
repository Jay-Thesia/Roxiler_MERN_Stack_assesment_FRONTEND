import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import "./index.css";
import React from "react";

const CategoryChart = ({ monthName, categories }: any) => {
  console.log(categories);
  return (
    <div
      className="category-chart-container"
      style={{ padding: 50, borderRadius: "10%" }}>
      <h2>
        <u> Category Chart</u> - <b style={{ color: "green" }}>{monthName}</b>
      </h2>
      <ResponsiveContainer
        width="100%"
        height={360}
        style={{ alignSelf: "flexStart" }}>
        <PieChart>
          <Pie
            cx="50%"
            cy="40%"
            data={categories}
            startAngle={0}
            endAngle={360}
            innerRadius="40%"
            outerRadius="70%"
            dataKey="items">
            {categories.map((each: any) => (
              <Cell
                name={each.category.toUpperCase()}
                fill={getRandomColor()}
              />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="bottom"
            // align=""
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default CategoryChart;
