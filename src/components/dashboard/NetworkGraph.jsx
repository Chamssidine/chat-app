// src/components/dashboard/NetworkGraph.jsx
import React from 'react';
import { ForceGraph2D } from 'react-force-graph';

export default function NetworkGraph({ data }) {
    return (
        <section className="section">
            <h2>Visualisation de réseau</h2>
            <ForceGraph2D
                graphData={data}
                nodeLabel="id"
                width={500}
                height={400}
            />
        </section>
    );
}
