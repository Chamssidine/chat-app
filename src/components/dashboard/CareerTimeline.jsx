import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaBriefcase } from 'react-icons/fa';

export default function CareerTimeline({ data }) {
    return (
        <section className="section">
            <h2>Chronologie de carrière</h2>
            <VerticalTimeline layout="1-column">
                {data.map((item, i) => (
                    <VerticalTimelineElement
                        key={i}
                        date={item.date}
                        icon={<FaBriefcase />}
                        contentStyle={{ background: '#f9f9f9' }}
                    >
                        <h3>{item.title}</h3>
                        <p>{item.company}</p>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </section>
    );
}
