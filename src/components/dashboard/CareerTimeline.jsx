// src/components/dashboard/CareerTimeline.jsx
import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { FaBriefcase } from 'react-icons/fa';
import 'react-vertical-timeline-component/style.min.css';
import './CareerTimeline.css';

export default function CareerTimeline({ data, theme = 'light' }) {
    return (
        <section className={`section career-timeline ${theme}`}>
            <h2>Chronologie de carrière</h2>
            <VerticalTimeline layout="1-column">
                {data.map((item, idx) => (
                    <VerticalTimelineElement
                        key={idx}
                        className="vertical-timeline-element--work"
                        date={item.date}
                        iconStyle={{ background: 'var(--accent-color)', color: '#fff' }}
                        icon={<FaBriefcase />}
                        contentStyle={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                        contentArrowStyle={{ borderRight: '8px solid var(--accent-color)' }}
                        animate={true}
                    >
                        <h3 className="vertical-timeline-element-title">{item.title}</h3>
                        <p className="vertical-timeline-element-company">{item.company}</p>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </section>
    );
}
