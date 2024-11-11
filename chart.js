// Data for charts
var data = [
  { date: '2024-06-01', value1: 22.7, value2: 18.9 },
  { date: '2024-06-02', value1: 23.7, value2: 19.6 },
  { date: '2024-06-03', value1: 24.7, value2: 24.6 },
  { date: '2024-06-04', value1: 20.5, value2: 28.6 },
  { date: '2024-06-05', value1: 17.5, value2: 55.6 },
  { date: '2024-06-06', value1: 26.6, value2: 44.6 },
  { date: '2024-06-07', value1: 29.7, value2: 55.6 },
  { date: '2024-06-08', value1: 32.8, value2: 55.8 },
];

// Extract the date and values for the chart
var labels = data.map(d => d.date);
var value1Data = data.map(d => d.value1);
var value2Data = data.map(d => d.value2);

var ctx = document.getElementById('chartCanvas').getContext('2d');

// Initialize Chart.js
var chart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: labels,
      datasets: [
          {
              label: 'Value 1',
              data: value1Data,
              borderColor: 'steelblue',
              backgroundColor: 'rgba(70,130,180,0.2)',
              fill: false
          },
          {
              label: 'Value 2',
              data: value2Data,
              borderColor: 'orange',
              backgroundColor: 'rgba(255,165,0,0.2)',
              fill: false
          }
      ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        labels: labels
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,  // Use point style for legend items
          pointStyle: 'circle'  // Set the legend icon to circle shape
        }
      }
    }
  }
});
// Toggle to Line Chart
document.getElementById('toggleLineChart').addEventListener('click', function() {
  chart.config.type = 'line';
  chart.options.indexAxis = 'x';
  chart.options.scales = {
      x: {
          type: 'category', // Use 'category' type for dates
          labels: labels,
          title: {
              display: true,
              text: 'Date'
          }
      },
      y: {
          beginAtZero: true,
          title: {
              display: true,
              text: 'Values'
          }
      }
  };
  // Reset to original dataset for the line chart
  chart.data.labels = labels;
  chart.data.datasets = [
      {
          label: 'Value 1',
          data: value1Data,
          borderColor: 'steelblue',
          backgroundColor: 'rgba(70,130,180,0.2)',
          fill: false
      },
      {
          label: 'Value 2',
          data: value2Data,
          borderColor: 'orange',
          backgroundColor: 'rgba(255,165,0,0.2)',
          fill: false
      }
  ];
  chart.update();
});

// Toggle to Horizontal Bar Chart
document.getElementById('toggleBarChart').addEventListener('click', function() {
  chart.config.type = 'bar';
  chart.options.indexAxis = 'y'; // Set to horizontal bar chart
  chart.options.scales = {
      x: {
          beginAtZero: true,
          title: {
              display: true,
              text: 'Values'
          }
      },
      y: {
          title: {
              display: true,
              text: 'Date'
          }
      }
  };
  // Reset to original dataset for the horizontal bar chart
  chart.data.labels = labels;
  chart.data.datasets = [
      {
          label: 'Value 1',
          data: value1Data,
          backgroundColor: 'steelblue'
      },
      {
          label: 'Value 2',
          data: value2Data,
          backgroundColor: 'orange'
      }
  ];
  chart.update();
});

// Toggle to Pie Chart
document.getElementById('togglePieChart').addEventListener('click', function() {
  chart.config.type = 'pie';
  chart.options.scales = {}; // Pie chart does not use scales
  chart.data = {
      labels: ['Value 1', 'Value 2'],
      datasets: [{
          label: 'Values',
          data: [value1Data.reduce((a, b) => a + b, 0), value2Data.reduce((a, b) => a + b, 0)],
          backgroundColor: ['steelblue', 'orange']
      }]
  };
  chart.update();
});

// Update charts based on scrubber input
document.getElementById('scrubber').addEventListener('input', function () {
  var value = +this.value;
  var index = Math.floor(value / 100 * (data.length - 1));

  // Update the datasets with only the selected index
  if (chart.config.type === 'pie') {
      // For Pie Chart: Aggregate the data
      chart.data.datasets[0].data = [data[index].value1, data[index].value2];
  } else {
      // For Line and Bar Charts
      chart.data.labels = [data[index].date];
      chart.data.datasets[0].data = [data[index].value1];
      chart.data.datasets[1].data = [data[index].value2];
  }

  chart.update();
});
