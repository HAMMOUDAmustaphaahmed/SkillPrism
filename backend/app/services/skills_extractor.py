import re
from typing import List, Dict, Tuple

SKILLS_DB: Dict[str, List[str]] = {
    "Frontend": [
        "React", "Vue.js", "Vue", "Angular", "Svelte", "SvelteKit", "Next.js",
        "Nuxt.js", "Gatsby", "Remix", "Astro", "HTML", "HTML5", "CSS", "CSS3",
        "SASS", "SCSS", "Less", "Tailwind CSS", "Tailwind", "Bootstrap",
        "Material UI", "MUI", "Chakra UI", "Ant Design", "Shadcn",
        "Redux", "Zustand", "MobX", "Recoil", "Jotai", "Context API",
        "Webpack", "Vite", "Parcel", "Rollup", "esbuild",
        "React Query", "TanStack Query", "SWR", "Apollo Client",
        "Framer Motion", "GSAP", "Three.js", "WebGL", "D3.js",
        "TypeScript", "JavaScript", "ES6", "jQuery",
        "PWA", "Web Components", "WebAssembly", "WASM",
    ],
    "Backend": [
        "Node.js", "Express", "Express.js", "NestJS", "Fastify", "Hapi",
        "FastAPI", "Django", "Django REST Framework", "Flask", "Starlette",
        "Spring Boot", "Spring", "Quarkus", "Micronaut",
        "Laravel", "Symfony", "CodeIgniter",
        "Rails", "Ruby on Rails", "Sinatra",
        "ASP.NET", ".NET", ".NET Core", "ASP.NET Core",
        "Gin", "Echo", "Fiber", "Chi",
        "Actix", "Axum", "Rocket",
        "REST API", "RESTful", "GraphQL", "gRPC", "WebSocket", "WebSockets",
        "tRPC", "OpenAPI", "Swagger",
        "Microservices", "Serverless", "Event-Driven",
    ],
    "Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C",
        "Go", "Golang", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
        "Scala", "Clojure", "Haskell", "Elixir", "Erlang",
        "R", "MATLAB", "Perl", "Bash", "Shell", "PowerShell",
        "SQL", "PL/SQL", "T-SQL", "Lua", "Dart", "F#",
        "Assembly", "COBOL", "Fortran",
    ],
    "Databases": [
        "PostgreSQL", "MySQL", "SQLite", "MariaDB", "Oracle", "SQL Server",
        "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
        "Firebase", "Firestore", "Supabase", "PlanetScale", "CockroachDB",
        "Neo4j", "InfluxDB", "TimescaleDB", "Couchbase", "RavenDB",
        "Prisma", "TypeORM", "SQLAlchemy", "Sequelize", "Mongoose",
        "Vector Database", "Pinecone", "Weaviate", "Qdrant",
    ],
    "Cloud & DevOps": [
        "AWS", "Amazon Web Services", "GCP", "Google Cloud Platform",
        "Azure", "Microsoft Azure", "IBM Cloud", "Oracle Cloud",
        "Docker", "Kubernetes", "K8s", "Docker Compose",
        "Terraform", "Ansible", "Pulumi", "Chef", "Puppet",
        "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
        "ArgoCD", "Flux", "Helm",
        "Nginx", "Apache", "Caddy", "HAProxy",
        "Linux", "Unix", "Ubuntu", "CentOS", "Debian",
        "Vercel", "Netlify", "Heroku", "Railway", "Render", "Fly.io",
        "Prometheus", "Grafana", "Datadog", "New Relic",
        "CloudFront", "S3", "EC2", "Lambda", "ECS", "EKS", "RDS",
        "Load Balancing", "Auto Scaling", "CDN",
        "IaC", "Infrastructure as Code", "SRE",
    ],
    "AI & Data": [
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
        "Artificial Intelligence", "AI", "MLOps",
        "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "sklearn",
        "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly",
        "OpenCV", "NLTK", "spaCy", "Transformers", "HuggingFace",
        "LangChain", "LlamaIndex", "OpenAI", "GPT", "LLM", "RAG",
        "Data Science", "Data Analysis", "Data Engineering",
        "Apache Spark", "Hadoop", "Kafka", "Airflow", "dbt",
        "Jupyter", "Tableau", "Power BI", "Looker", "Metabase",
        "Feature Engineering", "Model Training", "Model Deployment",
        "A/B Testing", "Statistics", "Linear Algebra",
        "Neural Networks", "CNN", "RNN", "LSTM", "Transformer",
        "Recommendation Systems", "Time Series", "Forecasting",
    ],
    "Mobile": [
        "iOS", "Android", "React Native", "Flutter", "Expo",
        "Swift", "SwiftUI", "Objective-C", "Kotlin", "Java",
        "Xamarin", "Ionic", "Cordova", "Capacitor",
        "Firebase", "Push Notifications", "App Store", "Play Store",
    ],
    "Security": [
        "Cybersecurity", "Information Security", "AppSec",
        "OAuth", "OAuth2", "JWT", "SAML", "SSO", "OpenID Connect",
        "HTTPS", "TLS", "SSL", "Encryption", "Hashing",
        "Penetration Testing", "OWASP", "SAST", "DAST",
        "Vault", "Secrets Management", "IAM", "RBAC",
        "SOC2", "ISO 27001", "GDPR", "Compliance",
    ],
    "Tools & Methods": [
        "Git", "GitHub", "GitLab", "Bitbucket", "SVN",
        "Jira", "Confluence", "Trello", "Notion", "Linear", "Asana",
        "Agile", "Scrum", "Kanban", "SAFe", "DevOps", "Lean",
        "TDD", "BDD", "DDD", "Clean Architecture", "SOLID",
        "Unit Testing", "Integration Testing", "E2E Testing",
        "Jest", "Vitest", "Cypress", "Playwright", "Selenium",
        "Pytest", "unittest", "JUnit", "Mocha",
        "Figma", "Sketch", "Adobe XD", "InVision", "Zeplin",
        "Postman", "Insomnia", "bruno",
        "Code Review", "Pair Programming", "Mentoring",
        "Technical Documentation", "Architecture Design",
        "System Design", "API Design", "Database Design",
        "Performance Optimization", "Debugging", "Profiling",
    ],
    "Soft Skills": [
        "Leadership", "Team Leadership", "Communication",
        "Problem Solving", "Critical Thinking", "Analytical Skills",
        "Project Management", "Time Management", "Prioritization",
        "Adaptability", "Creativity", "Innovation",
        "Collaboration", "Teamwork", "Cross-functional",
        "Mentoring", "Coaching", "Training",
        "Client Communication", "Stakeholder Management",
        "Presentation Skills", "Public Speaking",
        "Remote Work", "Autonomy", "Self-motivated",
    ],
}

ALIASES: Dict[str, str] = {
    "vue.js": "Vue",
    "node.js": "Node.js",
    "django rest framework": "Django REST Framework",
    "amazon web services": "AWS",
    "google cloud platform": "GCP",
    "microsoft azure": "Azure",
    "react.js": "React",
    "angular.js": "Angular",
    "express.js": "Express",
    "golang": "Go",
    "sklearn": "Scikit-learn",
    "k8s": "Kubernetes",
    "postgresql": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
}

ALL_SKILLS: Dict[str, str] = {}
for category, skills in SKILLS_DB.items():
    for skill in skills:
        ALL_SKILLS[skill.lower()] = skill


def extract_skills(text: str) -> Tuple[List[str], Dict[str, List[str]]]:
    """Extract skills from text using keyword matching."""
    if not text:
        return [], {}

    found_skills: List[str] = []
    found_lower: set = set()

    normalized = text.lower()
    normalized = re.sub(r'[^\w\s.#+\-]', ' ', normalized)

    sorted_skills = sorted(ALL_SKILLS.keys(), key=len, reverse=True)

    for skill_lower in sorted_skills:
        canonical = ALL_SKILLS[skill_lower]
        pattern = r'(?<![a-z0-9])' + re.escape(skill_lower) + r'(?![a-z0-9])'
        if re.search(pattern, normalized):
            if skill_lower not in found_lower and canonical not in found_skills:
                found_skills.append(canonical)
                found_lower.add(skill_lower)

    alias_check = ALIASES
    for alias, canonical in alias_check.items():
        if alias in normalized and canonical not in found_skills:
            found_skills.append(canonical)

    by_category: Dict[str, List[str]] = {}
    for skill in found_skills:
        for category, skills_list in SKILLS_DB.items():
            if skill in skills_list:
                by_category.setdefault(category, []).append(skill)
                break

    return found_skills, by_category
