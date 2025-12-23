import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Community from '../components/Community';

const categories = ["Tout", "Mathématiques", "Français", "Physique-Chimie", "Histoire-Géo", "Anglais", "SVT"];
import api from '../lib/api';
// Remove hardcoded allCourses

export default function Formation() {
    const [selectedCategory, setSelectedCategory] = useState("Tout");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await api.get('/courses');
                // Map backend data to frontend model
                const mapped = res.data.map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    author: c.teacher_name || 'Professeur',
                    lessons: 10, // Mock for now or sum modules?
                    duration: '2h', // Mock or sum
                    category: c.category_name || 'Général',
                    rating: 4.5,     // Default rating
                    image: c.thumbnail_url || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }));
                setCourses(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === "Tout" || course.category === selectedCategory || (course.category && course.category.includes(selectedCategory));
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Premium Header with White/Lime Gradient */}
            <div className="relative bg-white pt-32 pb-24 overflow-hidden border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lime-100 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary-dark rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
                        Catalogue 2024
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold font-display text-gray-900 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Révisez vos cours pour <br />
                        <span className="text-primary">le collège et le lycée</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Accédez à des centaines de cours conformes au programme officiel.
                        Maths, Français, Langues : tout pour réussir votre année.
                    </p>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-2xl mx-auto relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                        <div className="relative flex items-center bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary">
                            <span className="pl-5 text-2xl text-gray-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Rechercher un cours (ex: Pythagore, Révolution...)"
                                className="w-full bg-transparent border-none text-gray-700 placeholder-gray-400 px-4 py-3 focus:ring-0 text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-all hover:scale-105 shadow-md">
                                Rechercher
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main id="content" tabIndex={-1}>
                {/* Filters Navigation */}
                <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex flex-nowrap overflow-x-auto pb-4 gap-2 items-center sm:justify-center sm:flex-wrap no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border flex-shrink-0 ${selectedCategory === cat
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <section className="container mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                        <h2 className="text-3xl font-bold text-gray-900 font-display">
                            {selectedCategory === "Tout" ? "Tous les cours" : `Cours de ${selectedCategory}`}
                            <span className="ml-3 text-lg font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredCourses.length}</span>
                        </h2>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Trier par :</span>
                            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer hover:border-gray-300 transition-colors">
                                <option>Plus récents</option>
                                <option>Mieux notés</option>
                                <option>Plus populaires</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 col-span-full">Chargement des cours...</div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredCourses.map((course, index) => (
                                <div key={course.id} className="animate-fade-in-up opacity-0" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CourseCard {...course} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                            <p className="text-gray-500 text-lg mb-8">Essayez de modifier vos termes de recherche ou vos filtres.</p>
                            <button
                                onClick={() => { setSelectedCategory("Tout"); setSearchQuery(""); }}
                                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Voir tous les cours
                            </button>
                        </div>
                    )}
                </section>

                <Community />
            </main>
        </div>
    );
}
