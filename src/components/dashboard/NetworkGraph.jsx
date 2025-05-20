import React, { useRef, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import './NetworkGraph.css';

export default function NetworkGraph({ data }) {
    const fgRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            fgRef.current?.centerAt(0, 0, 1000);
            fgRef.current?.zoom(2, 1000);
        }, 300);
        return () => clearTimeout(timer);
    }, [data]);

    const getNodeColor = (type) => {
        switch (type) {
            case 'company': return '#5c6bc0';
            case 'tech': return '#26a69a';
            case 'education': return '#f39c12';
            default: return '#bdbdbd';
        }
    };

    const getNodeSize = (type) => {
        switch (type) {
            case 'company': return 10;
            case 'tech': return 7;
            case 'education': return 9;
            default: return 5;
        }
    };

    return (
        <section className="section network-graph">
            <h2>Visualisation de réseau</h2>
            <div className="graph-container">
                <ForceGraph2D
                    ref={fgRef}
                    graphData={data}
                    nodeLabel={(node) => `${node.id} (${node.type})`}
                    nodeAutoColorBy="type"
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.fillStyle = getNodeColor(node.type);
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, getNodeSize(node.type), 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.fillStyle = '#333';
                        ctx.fillText(label, node.x + 8, node.y + 3);
                    }}
                    width={window.innerWidth > 600 ? 600 : 300}
                    height={400}
                />
            </div>
            <div className="legend">
                <span><span className="dot company" /> Entreprise</span>
                <span><span className="dot tech" /> Technologie</span>
                <span><span className="dot education" /> Formation</span>
            </div>
        </section>
    );
}
