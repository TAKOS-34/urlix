import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Statistics = ({ data }) => {
    const transformedData = () => {
        const labels = data.map(item => new Date(item.day).toLocaleDateString());
        const redirectionCounts = data.map(item => item.redirectionCount);

        return {
            labels,
            datasets: [
                {
                    label: 'Redirections per day',
                    data: redirectionCounts,
                    borderColor: 'rgb(0, 0, 0)',
                    backgroundColor: 'rgb(0, 0, 0)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Redirections'
                }
            }
        }
    };

    return (
        <Line data={transformedData()} options={options} />
    );
};

export default Statistics;
