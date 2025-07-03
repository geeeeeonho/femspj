import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { name: '1월', value: 400 },
  { name: '2월', value: 300 },
  { name: '3월', value: 500 },
  { name: '4월', value: 200 },
  { name: '5월', value: 600 },
];

function BaseGraphComponent() {
  return (
    <div className="w-full h-96 p-4 bg-white shadow rounded-xl">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BaseGraphComponent;
