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
        {
            id: 'exp-2',
            company: 'Flipkart',
            role: 'SDE Intern',
            startDate: 'Jan 2022',
            endDate: 'Jun 2022',
            description:
                'Developed internal tools for inventory management. Implemented real-time notifications using WebSockets. Wrote unit tests achieving 92% code coverage.',
        },
    ],
    projects: [
        {
            id: 'proj-1',
            name: 'DevTracker',
            tech: 'React, Node.js, MongoDB',
            description:
                'A developer productivity tracker with GitHub integration, daily standup logs, and sprint analytics. 500+ active users.',
        },
        {
            id: 'proj-2',
            name: 'QuickDeploy CLI',
            tech: 'Go, Docker, AWS',
            description:
                'Open-source CLI tool for one-command deployment to AWS. Featured on Hacker News with 200+ GitHub stars.',
        },
    ],
    skills: 'React, Node.js, TypeScript, Python, PostgreSQL, MongoDB, Docker, AWS, GraphQL, Git, CI/CD, Redis',
    links: {
        github: 'https://github.com/arjunmehta',
        linkedin: 'https://linkedin.com/in/arjunmehta',
    },
}

export default SAMPLE_DATA
