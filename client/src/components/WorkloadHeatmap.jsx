import React from 'react';

const WorkloadHeatmap = ({ data }) => {
  if (!data || data.length === 0) return <p>No workload data available.</p>;

  return (
    <div className="card">
      <h3>Workload & Burnout Indicator</h3>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Open Tasks</th>
            <th>Overdue</th>
            <th>Workload Level</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.openTasks}</td>
              <td style={{ color: item.overdueTasks > 0 ? 'red' : 'inherit', fontWeight: item.overdueTasks > 0 ? 'bold' : 'normal' }}>
                {item.overdueTasks}
              </td>
              <td>
                <span className={`workload-indicator workload-${item.workloadLevel}`}></span>
                {item.workloadLevel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkloadHeatmap;
