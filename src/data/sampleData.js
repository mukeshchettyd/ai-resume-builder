/* Sample resume data for the "Load Sample Data" button */

const SAMPLE_DATA = {
    personal: {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@email.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India',
    },
    summary:
        'Results-driven Full Stack Developer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud services. Passionate about clean architecture and delivering high-impact user experiences.',
    education: [
        {
            id: 'edu-1',
            institution: 'Indian Institute of Technology, Bengaluru',
            degree: 'B.Tech in Computer Science',
            startDate: '2018',
            endDate: '2022',
            description: 'CGPA: 8.7/10. Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Machine Learning.',
        },
    ],
    experience: [
        {
            id: 'exp-1',
            company: 'Razorpay',
            role: 'Software Engineer',
            startDate: 'Jul 2022',
            endDate: 'Present',
            description:
                'Built payment dashboard used by 50K+ merchants. Reduced page load time by 40% through code splitting and lazy loading. Led migration from REST to GraphQL, reducing API calls by 60%.',
        },
    ],
    projects: [
        {
            id: 'proj-1',
            title: 'DevTracker',
            techStack: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
            description: 'A developer productivity tracker with GitHub integration and sprint analytics. Optimized database queries for 500+ active users.',
            liveUrl: 'https://devtracker.demo',
            githubUrl: 'https://github.com/arjunmehta/devtracker',
        },
        {
            id: 'proj-2',
            title: 'QuickDeploy CLI',
            techStack: ['Go', 'Docker', 'AWS'],
            description: 'Open-source CLI tool for one-command deployment to AWS. Achieving 2x faster deployments. Featured on Hacker News.',
            liveUrl: '',
            githubUrl: 'https://github.com/arjunmehta/quickdeploy',
        },
    ],
    skills: {
        technical: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'Next.js'],
        soft: ['Technical Leadership', 'Problem Solving', 'Team Mentoring'],
        tools: ['Git', 'Docker', 'AWS', 'Redis', 'CI/CD']
    },
    links: {
        github: 'https://github.com/arjunmehta',
        linkedin: 'https://linkedin.com/in/arjunmehta',
    },
}

export default SAMPLE_DATA
