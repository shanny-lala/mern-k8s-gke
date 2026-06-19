import styles from './AboutPage.module.css';

const STACK = [
  {
    category: 'Frontend',
    color: 'var(--color-accent-primary)',
    items: [
      { name: 'React 18', desc: 'Bibliothèque UI déclarative avec hooks' },
      { name: 'Vite', desc: 'Bundler ultra-rapide pour le développement' },
      { name: 'React Router', desc: 'Routage côté client (SPA)' },
      { name: 'Axios', desc: 'Client HTTP avec intercepteurs' },
    ],
  },
  {
    category: 'Backend',
    color: 'var(--color-accent-secondary)',
    items: [
      { name: 'Node.js', desc: 'Runtime JavaScript côté serveur' },
      { name: 'Express 4', desc: 'Framework HTTP minimaliste' },
      { name: 'Mongoose', desc: 'ODM pour MongoDB avec schémas' },
      { name: 'Morgan', desc: 'Journalisation des requêtes HTTP' },
    ],
  },
  {
    category: 'Base de données',
    color: 'var(--color-accent-green)',
    items: [
      { name: 'MongoDB', desc: 'Base de données NoSQL orientée documents' },
      { name: 'PersistentVolume', desc: 'Persistance des données dans Kubernetes' },
    ],
  },
  {
    category: 'Conteneurisation',
    color: 'var(--color-accent-purple)',
    items: [
      { name: 'Docker', desc: 'Images multi-stage optimisées' },
      { name: 'Nginx', desc: 'Serveur statique pour le frontend' },
      { name: 'Docker Compose', desc: 'Orchestration locale pour les tests' },
    ],
  },
  {
    category: 'Kubernetes',
    color: 'var(--color-accent-amber)',
    items: [
      { name: 'Minikube', desc: 'Cluster local pour le développement' },
      { name: 'Deployments', desc: 'Gestion déclarative des pods' },
      { name: 'Services', desc: 'Exposition et répartition de charge interne' },
      { name: 'HPA', desc: 'Autoscaling horizontal sur CPU / RAM' },
      { name: 'ConfigMap / Secret', desc: 'Séparation configuration / secrets' },
    ],
  },
  {
    category: 'Cloud',
    color: 'var(--color-accent-red)',
    items: [
      { name: 'GKE', desc: 'Google Kubernetes Engine pour le déploiement cloud' },
      { name: 'GCR', desc: 'Google Container Registry pour les images Docker' },
      { name: 'LoadBalancer', desc: 'Exposition publique sur GCP' },
    ],
  },
];

const ARCHITECTURE_STEPS = [
  {
    step: '01',
    title: 'Requête utilisateur',
    desc: "L'utilisateur envoie une requête HTTP vers le Load Balancer Kubernetes.",
  },
  {
    step: '02',
    title: 'Load Balancer / Service',
    desc: 'Le Service Kubernetes distribue la charge entre les pods frontend ou backend disponibles.',
  },
  {
    step: '03',
    title: 'Frontend (React)',
    desc: 'Nginx sert les fichiers statiques React. Les appels API sont transmis vers le backend.',
  },
  {
    step: '04',
    title: 'Backend (Node.js)',
    desc: 'Express traite la requête via les middlewares, valide les données et appelle le service métier.',
  },
  {
    step: '05',
    title: 'MongoDB',
    desc: 'Les données sont lues ou écrites dans la base de données avec persistance via PVC.',
  },
  {
    step: '06',
    title: 'Autoscaling (HPA)',
    desc: 'Si la charge CPU dépasse 50 %, le HPA crée automatiquement de nouveaux pods backend.',
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.intro}>
          <h1 className={styles.pageTitle}>Architecture du Projet</h1>
          <p className={styles.pageSubtitle}>
            Application MERN conteneurisée avec Docker, orchestrée par Kubernetes avec
            Horizontal Pod Autoscaler (HPA), déployée sur Google Cloud Platform.
            Ce projet constitue une introduction complète au Cloud Computing, Kubernetes,
            DevOps et aux architectures distribuées modernes.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Flux d'une requête</h2>
          <div className={styles.stepsGrid}>
            {ARCHITECTURE_STEPS.map((s) => (
              <div key={s.step} className={`glass-card ${styles.stepCard}`}>
                <span className={styles.stepNumber}>{s.step}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Technologies utilisées</h2>
          <div className={styles.stackGrid}>
            {STACK.map((category) => (
              <div
                key={category.category}
                className={`glass-card ${styles.stackCard}`}
                style={{ '--category-color': category.color }}
              >
                <h3 className={styles.categoryTitle}>{category.category}</h3>
                <ul className={styles.techList}>
                  {category.items.map((item) => (
                    <li key={item.name} className={styles.techItem}>
                      <span className={styles.techDot} />
                      <div>
                        <span className={styles.techName}>{item.name}</span>
                        <span className={styles.techDesc}>{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Commandes utiles</h2>
          <div className={styles.commandsGrid}>
            <CommandBlock
              title="Développement local"
              commands={[
                'cp backend/.env.example backend/.env',
                'cd backend && npm install && npm run dev',
                'cd frontend && npm install && npm run dev',
              ]}
            />
            <CommandBlock
              title="Docker Compose"
              commands={[
                'docker-compose up --build',
                'docker-compose down -v',
              ]}
            />
            <CommandBlock
              title="Kubernetes (Minikube)"
              commands={[
                'minikube start --cpus=4 --memory=8192',
                'eval $(minikube docker-env)',
                'bash scripts/deploy-minikube.sh',
                'kubectl get pods -n mern-app',
                'kubectl get hpa -n mern-app --watch',
              ]}
            />
            <CommandBlock
              title="Test de charge (HPA)"
              commands={[
                'bash scripts/load-test.sh',
                'kubectl get hpa -n mern-app --watch',
              ]}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function CommandBlock({ title, commands }) {
  return (
    <div className={`glass-card ${styles.commandBlock}`}>
      <h3 className={styles.commandTitle}>{title}</h3>
      <pre className={styles.codeBlock}>
        {commands.map((cmd, i) => (
          <code key={i} className={styles.codeLine}>
            <span className={styles.codePrompt}>$</span> {cmd}
          </code>
        ))}
      </pre>
    </div>
  );
}
