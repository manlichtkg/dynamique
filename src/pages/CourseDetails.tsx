import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CourseDetails() {
    const { id } = useParams();

    // Mock Data (In real app, fetch based on ID)
    const course = {
        title: 'Maths : Le Théorème de Pythagore',
        description: 'Maîtrisez l\'un des théorèmes fondamentaux de la géométrie. Ce cours couvre la théorie, les démonstrations et de nombreux exercices pratiques pour réussir vos examens.',
        author: 'Sophie Martin',
        category: 'Mathématiques',
        level: '4ème - 3ème',
        lessons: 12,
        duration: '2h 15m',
        rating: 4.9,
        students: 1234,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        syllabus: [
            { title: 'Introduction au triangle rectangle', duration: '15 min' },
            { title: 'Énoncé du théorème', duration: '20 min' },
            { title: 'Démonstration visuelle', duration: '25 min' },
            { title: 'Calculer une longueur (Application)', duration: '30 min' },
            { title: 'La réciproque de Pythagore', duration: '25 min' },
            { title: 'Exercices corrigés type Brevet', duration: '40 min' },
        ]
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[500px] bg-gray-900 text-white flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 pb-12 relative z-10 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="max-w-3xl animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{course.category}</span>
                            <span className="text-gray-300 text-sm font-medium">{course.level}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{course.title}</h1>
                        <p className="text-lg text-gray-300 mb-6 line-clamp-2 md:line-clamp-none">{course.description}</p>

                        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 text-lg">★</span>
                                <span className="text-white">{course.rating}</span>
                                <span>({course.students} élèves)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>👨‍🏫 {course.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>⏱ {course.duration}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto animate-scale-in">
                        <Link to="/lesson" className="block w-full md:w-auto text-center bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/30">
                            Commencer ce cours
                        </Link>
                        <p className="text-center text-xs text-gray-400 mt-3">Accès illimité avec votre abonnement</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos de ce cours</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">{course.description}</p>
                    </section>

                    {/* Syllabus */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                            <span>Programme du cours</span>
                            <span className="text-sm font-normal text-gray-500">{course.lessons} leçons • {course.duration} au total</span>
                        </h2>
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-100">
                            {course.syllabus.map((item, idx) => (
                                <div key={idx} className="p-5 flex items-center justify-between hover:bg-white transition-colors cursor-default group">
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold flex items-center justify-center text-sm group-hover:bg-primary group-hover:text-white transition-colors">{idx + 1}</span>
                                        <span className="font-medium text-gray-700 group-hover:text-gray-900">{item.title}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">{item.duration}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Instructor */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Votre Professeur</h2>
                        <div className="flex items-center gap-6 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={course.author} className="w-20 h-20 rounded-full object-cover border-4 border-lime-50" />
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">{course.author}</h3>
                                <p className="text-primary font-medium mb-2">Professeur certifié</p>
                                <p className="text-gray-500 text-sm">Passionné par l'enseignement et la pédagogie bienveillante. J'aide les élèves à reprendre confiance en eux.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block">
                    <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
                        <h3 className="font-bold text-xl text-gray-900 mb-6">Ce que vous allez apprendre</h3>
                        <ul className="space-y-4">
                            {['Maîtriser Pythagore', 'Rédiger une démonstration', 'Calculer des longueurs', 'Résoudre des problèmes complexes'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                    <span className="text-primary font-bold">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <hr className="my-6 border-gray-100" />
                        <div className="text-center">
                            <p className="font-bold text-gray-900 text-lg mb-1">Inclus dans Premium</p>
                            <p className="text-xs text-gray-500 mb-4">Accès à tous les cours + exercices</p>
                            <Link to="/register" className="block w-full py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">
                                S'abonner maintenant
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
