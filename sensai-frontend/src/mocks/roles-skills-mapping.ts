// Mock data for roles and skills mapping
export const MOCK_ROLES_SKILLS = {
  "Software Engineer": [
    "JavaScript", "Python", "React", "Node.js", "Git", "SQL", "REST APIs",
    "Data Structures", "Algorithms", "Testing", "Debugging", "Version Control"
  ],
  "Product Manager": [
    "Product Strategy", "User Research", "Data Analysis", "Project Management",
    "Stakeholder Communication", "A/B Testing", "Market Research", "Agile/Scrum",
    "Roadmap Planning", "Requirements Gathering", "KPI Tracking", "SQL"
  ],
  "Data Analyst": [
    "SQL", "Python", "Excel", "Tableau", "Power BI", "Statistics",
    "Data Visualization", "ETL", "Data Cleaning", "Business Intelligence",
    "Reporting", "Dashboard Creation", "R", "Google Analytics"
  ],
  "UX Designer": [
    "User Research", "Wireframing", "Prototyping", "Figma", "Sketch",
    "User Testing", "Information Architecture", "Design Systems",
    "Interaction Design", "Visual Design", "Accessibility", "HTML/CSS"
  ],
  "Data Scientist": [
    "Python", "R", "Machine Learning", "Statistics", "SQL", "Pandas",
    "NumPy", "Scikit-learn", "TensorFlow", "Data Visualization",
    "Feature Engineering", "Model Evaluation", "Deep Learning", "Big Data"
  ],
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Vue.js", "Angular",
    "TypeScript", "Responsive Design", "CSS Frameworks", "Git",
    "Webpack", "Testing", "Performance Optimization", "Cross-browser Compatibility"
  ],
  "Backend Developer": [
    "Python", "Java", "Node.js", "SQL", "NoSQL", "REST APIs", "GraphQL",
    "Microservices", "Docker", "AWS", "Database Design", "Security",
    "Performance Optimization", "Git"
  ],
  "DevOps Engineer": [
    "AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Bash Scripting",
    "Terraform", "Jenkins", "Git", "Monitoring", "Security", "Networking",
    "Infrastructure as Code", "Python"
  ],
  "Marketing Analyst": [
    "Google Analytics", "SQL", "Excel", "A/B Testing", "Campaign Analysis",
    "Customer Segmentation", "Conversion Optimization", "Social Media Analytics",
    "Email Marketing", "SEO/SEM", "Data Visualization", "Market Research"
  ],
  "Business Analyst": [
    "Requirements Gathering", "Process Mapping", "Data Analysis", "SQL",
    "Stakeholder Management", "Documentation", "Project Management",
    "Business Process Improvement", "Excel", "Power BI", "User Stories", "Testing"
  ]
};

// Skills by category for easier filtering
export const MOCK_SKILLS_CATEGORIES = {
  "Programming Languages": [
    "JavaScript", "Python", "Java", "TypeScript", "R", "SQL", "HTML", "CSS", "Bash Scripting"
  ],
  "Frameworks & Libraries": [
    "React", "Vue.js", "Angular", "Node.js", "Pandas", "NumPy", "Scikit-learn", "TensorFlow"
  ],
  "Tools & Platforms": [
    "Git", "Docker", "Kubernetes", "AWS", "Figma", "Sketch", "Tableau", "Power BI",
    "Google Analytics", "Jenkins", "Terraform"
  ],
  "Design & UX": [
    "User Research", "Wireframing", "Prototyping", "User Testing", "Information Architecture",
    "Design Systems", "Interaction Design", "Visual Design", "Accessibility"
  ],
  "Data & Analytics": [
    "Data Analysis", "Statistics", "Data Visualization", "ETL", "Data Cleaning",
    "Business Intelligence", "Machine Learning", "Feature Engineering", "Big Data"
  ],
  "Business & Management": [
    "Product Strategy", "Project Management", "Stakeholder Communication", "Agile/Scrum",
    "Requirements Gathering", "Process Mapping", "Market Research"
  ]
};

// Difficulty levels for skills
export const SKILL_DIFFICULTIES = {
  "easy": ["HTML", "CSS", "Excel", "Git", "Basic SQL", "Wireframing"],
  "medium": ["JavaScript", "Python", "React", "Data Analysis", "User Research", "A/B Testing"],
  "hard": ["Machine Learning", "Microservices", "Kubernetes", "Deep Learning", "System Design"]
};

export const MOCK_ROLES = Object.keys(MOCK_ROLES_SKILLS);
export const MOCK_getSkillsForRole = (role: string) => MOCK_ROLES_SKILLS[role] || [];