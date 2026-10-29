export const profile = {
  name: "Adithya R K Nambiar",
  role: "AI Engineer · Research Intern",
  email: "adithya6119@gmail.com",
  phone: "+91 8078280973",
  location: "Kerala, India",
  linkedin:
    "https://www.linkedin.com/in/adithya-r-k-nambiar-5a692b393/",
};

export const projects = [
  {
    number: "01",
    type: "Applied AI · Retrieval",
    name: "DocAssist",
    title: "A RAG-powered intelligent agent for medical queries",
    description:
      "An evidence-grounded assistant that turns medical knowledge into careful, context-rich answers using semantic retrieval and LLM reasoning.",
    tags: ["RAG", "Semantic search", "LLMs"],
    theme: "dark",
  },
  {
    number: "02",
    type: "Generative AI · Education",
    name: "GradeAid",
    title: "LLM-based short answer scoring and feedback",
    description:
      "A rubric-aware evaluation workflow designed to make written-answer feedback more consistent, explainable, and useful to learners.",
    tags: ["RAG", "Evaluation", "NLP"],
    theme: "light",
  },
  {
    number: "03",
    type: "Research · Reinforcement learning",
    name: "RDDPG",
    title: "Quantitative finance with recurrent reinforcement learning",
    description:
      "A recurrent deep deterministic policy gradient method for stock trading automation, presented at the 9th International Conference on ICTCS.",
    tags: ["RL", "Time series", "Research"],
    theme: "dark",
  },
];

export const experience = [
  {
    period: "Present",
    company: "NITK Surathkal",
    role: "Research Intern",
    location: "Surathkal, India",
    description:
      "Exploring practical research problems at the intersection of intelligent systems, language, and reliable machine learning.",
    current: true,
  },
  {
    period: "Feb 2025 — Aug 2025",
    company: "Rockwell Automation",
    role: "Data Engineer Intern",
    location: "Bengaluru, India",
    description:
      "Optimized large-scale healthcare data pipelines on Amgen’s RWD Platform using Databricks and AWS. Refactored data transformations and supported secure, highly available cloud systems for high-classification healthcare data.",
    current: false,
  },
  {
    period: "Aug 2023 — Oct 2023",
    company: "PixDynamics",
    role: "AI Intern",
    location: "Ernakulam, India",
    description:
      "Extracted facial embeddings into searchable vectors, evaluated Pinecone, Milvus, and Redis, and built similar-face search using ANNOY and KNN algorithms.",
    current: false,
  },
];

export const skillGroups = [
  {
    label: "Programming",
    items: ["Python", "SQL", "HTML/CSS"],
  },
  {
    label: "Generative AI",
    items: ["LLMs", "Generative AI", "Prompt Engineering", "RAG Pipelines", "LangChain", "Hugging Face"],
  },
  {
    label: "AI / ML",
    items: ["NLP", "Semantic Search", "Machine Learning", "Deep Learning", "API Integration"],
  },
  {
    label: "AI Infrastructure",
    items: ["FAISS", "Pinecone", "Milvus", "Databricks", "AWS S3"],
  },
];

export const languages = ["English", "Hindi", "Malayalam"];

export const publications = [
  {
    year: "2026",
    title:
      "From Pixels to Stories: A Scalable AI Framework for Dynamic Image Narratives Using Vision Transformers and GPT-2",
    venue: "ICT for Intelligent Systems · Lecture Notes in Networks and Systems",
    publisher: "Springer Nature Singapore",
    pages: "pp. 93–104",
    authors: ["K. R. Sayanthika", "R. K. Adithya Nambiar", "Alap S. Suresh", "B. R. Gokul Krishna", "Lekshmi S. Nair"],
    url: "https://link.springer.com/chapter/10.1007/978-981-96-9275-0_8",
  },
  {
    year: "2025",
    title:
      "Quantitative Finance with RDDPG: A Recurrent Reinforcement Learning Method for Stock Trading Automation",
    venue: "ICT: Applications and Social Interfaces · Lecture Notes in Networks and Systems",
    publisher: "Springer Nature Singapore",
    pages: "pp. 401–412",
    note: "Presented at the 9th International Conference on ICTCS, Jaipur, Dec 2024",
    authors: ["A. K. Annapoorna", "M. Sowji Krishna", "K. R. Sayanthika", "Adithya R. K. Nambiar", "Alfy Alex", "J. Divya Udayan"],
    url: "https://link.springer.com/chapter/10.1007/978-981-96-5754-4_35",
  },
];
