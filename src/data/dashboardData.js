// jsonSchema.js
export const dashboardSchema = {
    type: "object",
    properties: {
        formatCheck: {
            type: "object",
            properties: {
                score: { type: "number" },
                issues: {
                    type: "array",
                    items: { type: "string" },
                },
            },
            required: ["score", "issues"],
        },
        careerTimeline: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    date: { type: "string" },
                    title: { type: "string" },
                    company: { type: "string" },
                },
                required: ["date", "title", "company"],
            },
        },
        semanticAnalysis: {
            type: "object",
            properties: {
                matchedKeywords: { type: "number" },
                totalKeywords: { type: "number" },
                keywordsDetail: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            keyword: { type: "string" },
                            matched: { type: "boolean" },
                            frequency: { type: "number" },
                            importance: { type: "number" },
                        },
                        required: ["keyword", "matched", "frequency", "importance"],
                    },
                },
            },
            required: ["matchedKeywords", "totalKeywords", "keywordsDetail"],
        },
        benchmark: {
            type: "object",
            properties: {
                salaryPercentile: { type: "number" },
                roleLevel: { type: "string" },
            },
            required: ["salaryPercentile", "roleLevel"],
        },
        softSkills: {
            type: "object",
            properties: {
                communication: { type: "number" },
                leadership: { type: "number" },
                adaptability: { type: "number" },
            },
            required: ["communication", "leadership", "adaptability"],
        },
        trainingSuggestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    link: { type: "string" },
                },
                required: ["title", "description", "link"],
            },
        },
        completenessIndex: { type: "number" },
        keywordDensity: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    keyword: { type: "string" },
                    density: { type: "number" },
                },
                required: ["keyword", "density"],
            },
        },
        networkGraph: {
            type: "object",
            properties: {
                nodes: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            type: { type: "string" },
                        },
                        required: ["id", "type"],
                    },
                },
                links: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            source: { type: "string" },
                            target: { type: "string" },
                        },
                        required: ["source", "target"],
                    },
                },
            },
            required: ["nodes", "links"],
        },
        interviewSimulator: {
            type: "object",
            properties: {
                questions: {
                    type: "array",
                    items: { type: "string" },
                },
            },
            required: ["questions"],
        },
    },
    required: [
        "formatCheck",
        "careerTimeline",
        "semanticAnalysis",
        "benchmark",
        "softSkills",
        "trainingSuggestions",
        "completenessIndex",
        "keywordDensity",
        "networkGraph",
        "interviewSimulator",
    ],
};
