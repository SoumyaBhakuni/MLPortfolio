import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Internship from './pages/Internship';
import Contact from './pages/Contact';
import EDA from './pages/projects/EDA';
import LinearRegression from './pages/projects/LinearRegression';
import ImageClassification from './pages/projects/ImageClassification';
import KMeans from './pages/projects/KMeans';
import DecisionTree from './pages/projects/DecisionTree';
import NaiveBayes from './pages/projects/NaiveBayes';
import PCA from './pages/projects/PCA';
import NeuralNetwork from './pages/projects/NeuralNetwork';
import ARIMA from './pages/projects/ARIMA';
import SVM from './pages/projects/SVM';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-cyan-400/20 selection:text-cyan-200 relative overflow-x-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '120px 120px'
          }}
        />
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/eda" element={<EDA />} />
            <Route path="/projects/linear-regression" element={<LinearRegression />} />
            <Route path="/projects/image-classification" element={<ImageClassification />} />
            <Route path="/projects/kmeans" element={<KMeans />} />
            <Route path="/projects/decision-tree" element={<DecisionTree />} />
            <Route path="/projects/naive-bayes" element={<NaiveBayes />} />
            <Route path="/projects/pca" element={<PCA />} />
            <Route path="/projects/neural-network" element={<NeuralNetwork />} />
            <Route path="/projects/arima" element={<ARIMA />} />
            <Route path="/projects/svm" element={<SVM />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;