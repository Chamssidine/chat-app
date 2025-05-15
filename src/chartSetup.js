import {
    Chart as ChartJS,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    LineController,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    BarElement,
    LineController,
    Filler,
    Tooltip,
    Legend
);
