import React, { useMemo, useState } from 'react';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import Community from '../components/Community';

export default function Home() {
	return (
		<>
			<Hero />

			{/* Features Section */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-6">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<span className="text-primary font-bold uppercase tracking-wider text-sm">Pourquoi nous choisir ?</span>
						<h2 className="text-3xl md:text-4xl font-bold font-display mt-2 mb-4 text-gray-900">Apprenez en vous amusant</h2>
						<p className="text-gray-500 text-lg">Notre méthode unique combine pédagogie éprouvée et gamification pour vous garder motivé.</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{ title: 'Progression Ludique', desc: 'Gagnez des points, débloquez des badges et montez dans le classement.', icon: '🏆' },
							{ title: 'Cours Interactifs', desc: 'Des leçons courtes et engageantes conçues pour une mémorisation optimale.', icon: '⚡' },
							{ title: 'Communauté Active', desc: 'Échangez avec d\'autres apprenants et progressez ensemble.', icon: '🤝' },
						].map((feature, idx) => (
							<div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-soft-lg transition-all hover:-translate-y-1">
								<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">
									{feature.icon}
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
								<p className="text-gray-600 leading-relaxed">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gray-900 text-white overflow-hidden relative">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

				<div className="container mx-auto px-6 relative z-10 text-center">
					<h2 className="text-3xl md:text-5xl font-bold font-display mb-6">Prêt à commencer votre voyage ?</h2>
					<p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">Rejoignez plus de 10 000 étudiants qui ont transformé leur façon d'apprendre avec Ecole-Facile.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a href="/register" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all transform hover:scale-105">
							Créer mon compte gratuit
						</a>
						<a href="/formation" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
							Voir le catalogue
						</a>
					</div>
				</div>
			</section>

			<Community />
		</>
	);
}
