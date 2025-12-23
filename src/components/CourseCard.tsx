import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
	id: number;
	title: string;
	author: string;
	lessons: number;
	duration: string;
	category?: string;
	rating?: number;
	image?: string;
	progress?: number;
	showProgress?: boolean;
};

export default function CourseCard({ id, title, author, lessons, duration, category, rating, image, progress, showProgress }: Props) {
	const imgSrc =
		image ||
		'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';

	return (
		<Link
			to={`/course/${id}`}
			className="block bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
			aria-labelledby={`course-${id}-title`}
		>
			<div className="relative">
				<img
					src={imgSrc}
					alt={title}
					loading="lazy"
					className="w-full h-40 object-cover sm:h-44 group-hover:scale-105 transition-transform duration-500"
				/>
				{category && (
					<span className="absolute top-3 left-3 bg-primary text-white px-2 py-1 text-xs rounded-full font-medium shadow-sm">
						{category}
					</span>
				)}
			</div>

			<div className="p-4">
				<h3 id={`course-${id}-title`} className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
					{title}
				</h3>
				<p className="text-sm text-gray-500 mt-1">{author}</p>

				{showProgress && progress !== undefined ? (
					<div className="mt-4">
						<div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
							<span>Progression</span>
							<span>{progress}%</span>
						</div>
						<div className="w-full bg-gray-100 rounded-full h-1.5">
							<div
								className="bg-primary h-1.5 rounded-full transition-all duration-1000"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				) : (
					<div className="mt-4 flex items-center justify-between text-sm text-gray-600">
						<span className="flex items-center gap-1">
							📚 {lessons} leçons
						</span>
						<span className="flex items-center gap-1">
							⏱ {duration}
						</span>
					</div>
				)}

				{!showProgress && (
					<div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
						<div className="flex items-center gap-1">
							<span className="text-yellow-400">★</span>
							<span className="font-bold text-gray-900">{rating ? rating.toFixed(1) : 'New'}</span>
						</div>
						<span className="text-primary font-bold text-sm">Voir le cours →</span>
					</div>
				)}
			</div>
		</Link>
	);
}
