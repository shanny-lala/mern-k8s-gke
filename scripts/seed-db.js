'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_k8s';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

const SEED_DATA = [
  { title: 'Installer Docker sur Ubuntu', description: 'Suivre la documentation officielle Docker pour Ubuntu 22.04', status: 'completed', priority: 'high' },
  { title: 'Configurer Minikube', description: 'Demarrer un cluster Minikube avec 4 CPU et 8Go de RAM', status: 'completed', priority: 'high' },
  { title: 'Creer les Dockerfiles', description: 'Ecrire les Dockerfiles multi-stage pour le frontend et le backend', status: 'completed', priority: 'high' },
  { title: 'Deployer MongoDB sur Kubernetes', description: 'Creer le PVC, le Deployment et le Service pour MongoDB', status: 'in-progress', priority: 'high' },
  { title: 'Configurer le HPA', description: 'Mettre en place l\'autoscaling horizontal sur le deployment backend', status: 'in-progress', priority: 'high' },
  { title: 'Tester avec Apache Benchmark', description: 'Lancer ab -n 10000 -c 100 et observer le scaling des pods', status: 'pending', priority: 'high' },
  { title: 'Creer un projet GCP', description: 'Creer un projet sur Google Cloud Platform et activer l\'API Kubernetes Engine', status: 'pending', priority: 'medium' },
  { title: 'Creer un cluster GKE', description: 'Creer un cluster Kubernetes sur GKE avec les ressources minimales', status: 'pending', priority: 'medium' },
  { title: 'Pousser les images sur GCR', description: 'Tagger et pousser les images Docker vers Google Container Registry', status: 'pending', priority: 'medium' },
  { title: 'Rediger le rapport technique', description: 'Documenter l\'architecture, les choix techniques et les resultats des tests', status: 'pending', priority: 'medium' },
  { title: 'Preparer les captures d\'ecran', description: 'Capturer le dashboard, le HPA en action et les metriques de performance', status: 'pending', priority: 'low' },
  { title: 'Mettre en place le monitoring', description: 'Configurer Prometheus et Grafana pour la surveillance du cluster', status: 'pending', priority: 'low' },
];

async function seed() {
  console.log('[seed] Connexion a MongoDB :', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const existing = await Task.countDocuments();
  if (existing > 0) {
    console.log(`[seed] ${existing} taches existent deja. Suppression...`);
    await Task.deleteMany({});
  }

  const created = await Task.insertMany(SEED_DATA);
  console.log(`[seed] ${created.length} taches inserees avec succes`);

  await mongoose.disconnect();
  console.log('[seed] Connexion fermee');
}

seed().catch((err) => {
  console.error('[seed] Erreur :', err.message);
  mongoose.disconnect();
  process.exit(1);
});
