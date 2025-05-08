
import { Bar, Line, Pie } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, PieChart, LineChart } from "recharts";

interface ChartProps {
  type: "area" | "bar" | "line" | "pie";
  data: any[];
  title: string;
  subtitle?: string;
  xKey: string;
  yKey: string;
  height?: number;
  colors?: string[];
}

const Chart = ({
  type,
  data,
  title,
  subtitle,
  xKey,
  yKey,
  height = 300,
  colors = ["#1a365d", "#c99a2c", "#64748b", "#7f1d1d"]
}: ChartProps) => {
  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart
            data={data}
            width={500}
            height={height}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey={yKey} stroke={colors[0]} />
            <Bar dataKey={yKey} fill="url(#colorValue)" />
          </AreaChart>
        );
      
      case "bar":
        return (
          <BarChart
            data={data}
            width={500}
            height={height}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <Bar dataKey={yKey} fill={colors[0]} />
          </BarChart>
        );
      
      case "line":
        return (
          <LineChart
            data={data}
            width={500}
            height={height}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <Line type="monotone" dataKey={yKey} stroke={colors[0]} />
          </LineChart>
        );
      
      case "pie":
        return (
          <PieChart width={500} height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey={yKey}
              nameKey={xKey}
              label
            />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex justify-center">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default Chart;
