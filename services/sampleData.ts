
import { Course, CLO, PloMapping, Evaluation } from '../types';

export interface SampleCourseData {
    course: Course;
    clos: CLO[];
    mapping: PloMapping;
    evaluations: Evaluation[];
}

export const sampleCourses: SampleCourseData[] = [
    {
        course: {
            name: "Introduction to Web Development",
            code: "CS101",
            credits: 3,
            description: "A foundational course on modern web development, covering HTML, CSS, and JavaScript to build interactive websites.",
        },
        clos: [
            { id: "CLO1", description: "Develop and structure web pages using semantic HTML5.", bloomLevel: "Applying", skillType: "Technical Skill" },
            { id: "CLO2", description: "Design and style responsive web layouts using CSS Flexbox and Grid.", bloomLevel: "Applying", skillType: "Technical Skill" },
            { id: "CLO3", description: "Implement interactive user interfaces with JavaScript and DOM manipulation.", bloomLevel: "Applying", skillType: "Technical Skill" },
            { id: "CLO4", description: "Analyze a design specification to produce a functional web application.", bloomLevel: "Analyzing", skillType: "Analytical Skill" },
            { id: "CLO5", description: "Collaborate effectively in a small team to complete a web project.", bloomLevel: "Creating", skillType: "Soft Skill" },
        ],
        mapping: {
            "CLO1": ["PLO2"],
            "CLO2": ["PLO2"],
            "CLO3": ["PLO1", "PLO6"],
            "CLO4": ["PLO1", "PLO2"],
            "CLO5": ["PLO3", "PLO5"],
        },
        evaluations: [
            { cloId: "CLO1", achievement: 95 },
            { cloId: "CLO2", achievement: 88 },
            { cloId: "CLO3", achievement: 82 },
            { cloId: "CLO4", achievement: 75 },
            { cloId: "CLO5", achievement: 91 },
        ],
    },
    {
        course: {
            name: "Software Engineering Principles",
            code: "SE305",
            credits: 4,
            description: "An in-depth study of software engineering principles, covering requirements, design, testing, and project management.",
        },
        clos: [
            { id: "CLO1", description: "Define software requirements and create specification documents.", bloomLevel: "Remembering", skillType: "Professional Skill" },
            { id: "CLO2", description: "Apply UML diagrams to model software system designs.", bloomLevel: "Applying", skillType: "Technical Skill" },
            { id: "CLO3", description: "Evaluate different software testing strategies for a given project.", bloomLevel: "Evaluating", skillType: "Analytical Skill" },
            { id: "CLO4", description: "Communicate technical design choices clearly to team members.", bloomLevel: "Understanding", skillType: "Communication Skill" },
            { id: "CLO5", description: "Recognize ethical responsibilities in software development scenarios.", bloomLevel: "Understanding", skillType: "Soft Skill" },
        ],
        mapping: {
            "CLO1": ["PLO1"],
            "CLO2": ["PLO2"],
            "CLO3": ["PLO6"],
            "CLO4": ["PLO3"],
            "CLO5": ["PLO4"],
        },
        evaluations: [
            { cloId: "CLO1", achievement: 92 },
            { cloId: "CLO2", achievement: 85 },
            { cloId: "CLO3", achievement: 78 },
            { cloId: "CLO4", achievement: 90 },
            { cloId: "CLO5", achievement: 94 },
        ],
    },
];
