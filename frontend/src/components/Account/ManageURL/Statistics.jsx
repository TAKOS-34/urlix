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
                    borderColor: 'rgb(255, 255, 255)',
                    backgroundColor: 'rgb(255, 255, 255)',
                    pointBackgroundColor: '#f9fafb',
                    pointBorderColor: '#f9fafb',
                    pointHoverBackgroundColor: '#f9fafb',
                    pointHoverBorderColor: '#f9fafb',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#f9fafb'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#f9fafb'
                },
                grid: {
                    color: 'rgba(249, 250, 251, 0.15)'
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: '#f9fafb'
                }
            },
            y: {
                ticks: {
                    color: '#f9fafb'
                },
                grid: {
                    color: 'rgba(249, 250, 251, 0.15)'
                },
                title: {
                    display: true,
                    text: 'Redirections',
                    color: '#f9fafb'
                }
            }
        }
    };

    return (
        <Line data={transformedData()} options={options} />
    );
};

export default Statistics;
