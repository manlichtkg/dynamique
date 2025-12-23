import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';


export default function Lesson() {
    const { courseId } = useParams(); // Get courseId from URL
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState('contenu');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Data State
    const [modules, setModules] = useState<any[]>([]);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
    const [nextLessonId, setNextLessonId] = useState<number | null>(null);
    const [prevLessonId, setPrevLessonId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch Course & Progress
    useEffect(() => {
        const loadData = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                // 1. Fetch Course details (Modules + Lessons)
                const courseRes = await api.get(`/courses/${courseId}`);
                const courseModules = courseRes.data.modules || [];
                setModules(courseModules);

                // 2. Fetch User Progress (to tick checkmarks)
                const progressRes = await api.get(`/progress/${courseId}`);
                const doneIds = progressRes.data.completedLessonIds || [];
                setCompletedLessonIds(doneIds);

                // 3. Determine Initial Active Lesson
                // Flatten all lessons to find first or pick one
                const allLessons = courseModules.flatMap((m: any) => m.lessons);

                if (allLessons.length > 0) {
                    // Default to first lesson if not navigating to specific one
                    // Optionally find first *uncompleted* lesson
                    const firstUnfinished = allLessons.find((l: any) => !doneIds.includes(l.id));
                    setCurrentLesson(firstUnfinished || allLessons[0]);
                }

            } catch (err) {
                console.error("Failed to load lesson data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [courseId]);

    // Update Next/Prev when currentLesson changes
    useEffect(() => {
        if (!currentLesson || modules.length === 0) return;

        const allLessons = modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);

        setPrevLessonId(currentIndex > 0 ? allLessons[currentIndex - 1].id : null);
        setNextLessonId(currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : null);
    }, [currentLesson, modules]);

    const handleLessonChange = (lessonId: number) => {
        const allLessons = modules.flatMap(m => m.lessons);
        const lesson = allLessons.find(l => l.id === lessonId);
        if (lesson) setCurrentLesson(lesson);
    };

    const handleCompleteLesson = async () => {
        if (!currentLesson || !courseId) return;

        try {
            // Optimistic UI update
            if (!completedLessonIds.includes(currentLesson.id)) {
                setCompletedLessonIds(prev => [...prev, currentLesson.id]);
                window.dispatchEvent(new Event('confetti'));

                await api.post('/progress', {
                    course_id: courseId,
                    lesson_id: currentLesson.id,
                    status: 'completed'
                });
            }

            // Auto advance
            if (nextLessonId) {
                handleLessonChange(nextLessonId);
            }
        } catch (error) {
            console.error("Failed to save progress", error);
            // Revert optimism if needed (simple toast error better)
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Chargement du cours...</div>;
    if (!currentLesson) return <div className="p-10 text-center">Aucune leçon disponible.</div>;

    const allLessons = modules.flatMap(m => m.lessons);
    const lessonIndex = allLessons.findIndex(l => l.id === currentLesson.id) + 1;

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-gray-50 text-gray-900 font-sans">
            <div className="flex flex-1 overflow-hidden relative">

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10">

                    {/* Video Player Section (Dark for Focus) */}
                    <div className="flex-1 bg-black relative flex items-center justify-center group">
                        {/* Video Container */}
                        <div className="w-full h-full max-h-[85vh] bg-black relative shadow-lg">
                            {currentLesson.content_type === 'video' ? (
                                <iframe
                                    className="w-full h-full"
                                    src={currentLesson.content_url || "https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0"}
                                    title={currentLesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white p-10">
                                    <h2 className="text-3xl font-bold mb-4">{currentLesson.title}</h2>
                                    <div className="prose prose-invert max-w-2xl text-center">
                                        <p>{currentLesson.content_body || "Contenu textuel de la leçon."}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Bar: Title & Navigation (Light) */}
                    <div className="bg-white border-t border-gray-200 p-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 z-20 shadow-sm">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-primary font-bold tracking-wider uppercase text-xs">Module {modules.find(m => m.id === currentLesson.module_id)?.order_index || 1}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-500 text-xs font-medium">{Math.floor((currentLesson.duration_seconds || 600) / 60)} min</span>
                            </div>
                            <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{lessonIndex}. {currentLesson.title}</h1>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
                            <button
                                onClick={() => prevLessonId && handleLessonChange(prevLessonId)}
                                disabled={!prevLessonId}
                                className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 rounded-lg font-medium transition-colors text-sm shadow-sm"
                            >
                                ← Précédent
                            </button>
                            <button
                                onClick={handleCompleteLesson}
                                className="flex-1 md:flex-none px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
                            >
                                {completedLessonIds.includes(currentLesson.id) ? (
                                    <><span>✓</span> Terminé</>
                                ) : (
                                    <>Terminer la leçon</>
                                )}
                            </button>
                            <button
                                onClick={() => nextLessonId && handleLessonChange(nextLessonId)}
                                disabled={!nextLessonId}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm"
                            >
                                Suivant →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Curriculum (Light) */}
                <div className={`
                    fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 z-30
                    md:relative md:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:hidden'}
                `}>
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg font-display">Programme</h2>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{modules.length} Modules • {allLessons.length} Leçons</p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-900 p-2">✕</button>
                        </div>

                        {/* Modules List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {modules.map(module => (
                                <div key={module.id} className="border-b border-gray-50 last:border-0">
                                    <div className="px-5 py-3 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wide">Module {module.order_index}</h3>
                                        <p className="font-bold text-sm text-gray-900 mt-0.5">{module.title}</p>
                                    </div>
                                    <div>
                                        {module.lessons && module.lessons.map((lesson: any) => {
                                            const isActive = currentLesson && currentLesson.id === lesson.id;
                                            const isCompleted = completedLessonIds.includes(lesson.id);

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    onClick={() => !isActive && handleLessonChange(lesson.id)}
                                                    className={`px-5 py-3 flex gap-3 cursor-pointer transition-all border-l-4 ${isActive
                                                        ? 'bg-lime-50 border-primary'
                                                        : 'hover:bg-gray-50 border-transparent'
                                                        }`}
                                                >
                                                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted || isActive
                                                        ? 'bg-primary border-primary text-white'
                                                        : 'border-gray-300 text-transparent'
                                                        }`}>
                                                        <span className="text-[10px] font-bold">✓</span>
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium leading-snug ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        <span className="text-xs text-gray-400 block mt-1 font-medium">{Math.floor((lesson.duration_seconds || 600) / 60)} min</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs / Info Section - Light Theme */}
            <div className="flex-1 bg-gray-50 text-gray-900 overflow-y-auto relative z-10 border-t border-gray-200">
                <div className="container mx-auto px-6 py-8 max-w-5xl">
                    <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto pb-1 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                        {['À propos', 'Exercices', 'Questions Q&A', 'Ressources'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold tracking-wide uppercase transition-all relative whitespace-nowrap ${activeTab === tab
                                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'À propos' && (
                        <div className="grid md:grid-cols-3 gap-12 animate-fade-in-up">
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900 font-display">Résumé du cours</h3>
                                <div className="prose prose-lime max-w-none text-gray-600 leading-relaxed">
                                    <p>
                                        Dans ce cours fondamental de mathématiques niveau 4ème, nous allons découvrir l'un des théorèmes les plus célèbres de la géométrie : le <strong>Théorème de Pythagore</strong>.
                                    </p>
                                    <p>
                                        Ce théorème permet de calculer la longueur d'un côté d'un triangle rectangle connaissant les deux autres. Il est essentiel pour la suite de votre scolarité !
                                    </p>
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm my-6">
                                        <h4 className="font-bold text-gray-900 mb-2">Au programme :</h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">✓</span>
                                                Définition d'un triangle rectangle et de l'hypoténuse
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">✓</span>
                                                L'énoncé du théorème (a² + b² = c²)
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">✓</span>
                                                Exemple d'application concret
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>👨‍🏫</span> Professeur
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Prof" className="w-12 h-12 rounded-full border-2 border-lime-100 shadow-sm" />
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">M. Martin</p>
                                            <p className="text-xs text-gray-500">Professeur de Mathématiques</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Exercices' && (
                        <div className="animate-fade-in-up">
                            <h3 className="text-2xl font-bold text-gray-900 font-display mb-6">Exercices Interactifs</h3>
                            <div className="grid gap-4">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/50 transition-colors shadow-sm group cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-lime-100 text-primary rounded-lg flex items-center justify-center font-bold">1</div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Quiz Rapide : L'hypoténuse</h4>
                                                <p className="text-sm text-gray-500">5 questions • Facile</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors font-medium text-sm">Commencer</button>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/50 transition-colors shadow-sm group cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-lime-100 text-primary rounded-lg flex items-center justify-center font-bold">2</div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Calculs de longueurs</h4>
                                                <p className="text-sm text-gray-500">3 problèmes • Moyen</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors font-medium text-sm">Commencer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Q&A Tab (similar structure but light) */}
                    {activeTab === 'Questions Q&A' && (
                        <div className="max-w-3xl animate-fade-in-up">
                            {/* Input Area */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                                <textarea
                                    placeholder="Posez votre question..."
                                    className="w-full border-0 bg-gray-50 rounded-lg p-4 focus:ring-2 focus:ring-primary outline-none min-h-[80px] text-gray-700 placeholder-gray-400"
                                ></textarea>
                                <div className="flex justify-end mt-3">
                                    <button className="px-5 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-md">Envoyer</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Toggle (Mobile) */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 bg-white text-gray-900 p-3 rounded-l-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-40 hover:text-primary transition-colors md:hidden border border-gray-100"
                    aria-label="Ouvrir le programme"
                >
                    ◀
                </button>
            )}
        </div>
    );
}
