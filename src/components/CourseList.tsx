import React from 'react';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const courses = [
  { id: 1, title: 'Introduction à React v18', author: 'Sophie Martin', lessons: 12, duration: '3h 15m', category: 'Frontend', rating: 4.9, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Maîtriser TypeScript', author: 'Thomas Dubois', lessons: 18, duration: '6h 30m', category: 'Langage', rating: 4.8, image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'UI Design Avancé', author: 'Marie Leroy', lessons: 8, duration: '2h 45m', category: 'Design', rating: 4.7, image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Node.js & Express API', author: 'Karim Ben', lessons: 14, duration: '4h 10m', category: 'Backend', rating: 4.6, image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

export default function CourseList() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold font-display text-gray-900">Cours Populaires</h2>
            <p className="text-gray-500 mt-2">Explorez nos formations les plus plébiscitées</p>
          </div>
          <Link to="/formation" className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            Tout voir
          </Link>
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map(c => <CourseCard key={c.id} {...c} />)}
        </div>
      </div>
    </section>
  );
}
