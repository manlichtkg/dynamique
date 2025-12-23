import React, { useMemo, useState } from 'react';
import Hero from '../components/Hero';
import CourseCard from '../components/CourseCard';
import Community from '../components/Community';

const sampleCourses = [
    { id: 1, title: 'Intro to React', author: 'Jane Doe', lessons: 12, duration: '3h' },
    { id: 2, title: 'Advanced TypeScript', author: 'John Smith', lessons: 18, duration: '6h' },
    { id: 3, title: 'UI Design Basics', author: 'Anna Lee', lessons: 8, duration: '2h' },
];

export default function Connection() {
	// new: search + duration filter state
	const [searchTerm, setSearchTerm] = useState('');
	const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');

	// helper to parse '3h' -> 3
	const parseHours = (d: string) => Number(d.replace(/h.*$/, '')) || 0;

	// memoized filtered list
	const filteredCourses = useMemo(() => {
		return sampleCourses.filter(c => {
			const matchesSearch = !searchTerm || `${c.title} ${c.author}`.toLowerCase().includes(searchTerm.toLowerCase());
			if (!matchesSearch) return false;

			const hours = parseHours(c.duration);
			if (durationFilter === 'short' && hours >= 3) return false;
			if (durationFilter === 'medium' && (hours < 3 || hours > 5)) return false;
			if (durationFilter === 'long' && hours <= 5) return false;

			return true;
		});
	}, [searchTerm, durationFilter]);

	return (
		<>
			<Hero />

			<main id="content" tabIndex={-1}>
				{/* Controls: search + filters */}
				<section className="mt-8 container mx-auto px-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h2 className="text-2xl font-semibold">Featured Courses</h2>
							<p className="text-sm text-gray-500">{filteredCourses.length} result{filteredCourses.length !== 1 ? 's' : ''}</p>
						</div>
						<div className="flex items-center gap-3">
							<input
								type="search"
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								placeholder="Search courses or authors..."
								className="border rounded-md px-3 py-2 w-60 focus:outline-none focus:ring"
								aria-label="Search courses"
							/>
							<div className="flex gap-2">
								{/* duration filter chips */}
								{[
									{ key: 'all', label: 'All' },
									{ key: 'short', label: '< 3h' },
									{ key: 'medium', label: '3–5h' },
									{ key: 'long', label: '> 5h' },
								].map(f => (
									<button
										key={f.key}
										type="button"
										className={`px-3 py-1 rounded-md text-sm ${
											durationFilter === (f.key as any) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
										}`}
										onClick={() => setDurationFilter(f.key as any)}
										aria-pressed={durationFilter === (f.key as any)}
									>
										{f.label}
									</button>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="mt-6 mb-10 container mx-auto px-6">
					<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{filteredCourses.length > 0 ? (
							filteredCourses.map(c => <CourseCard key={c.id} {...c} />)
						) : (
							<div className="col-span-full p-6 border rounded-md text-center">
								<p className="text-lg font-medium mb-2">No courses found</p>
								<p className="text-sm text-gray-500 mb-4">Try adjusting your search or clearing filters.</p>
								<button
									className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
									onClick={() => {
										setSearchTerm('');
										setDurationFilter('all');
									}}
								>
									Clear filters
								</button>
							</div>
						)}
					</div>
				</section>

				{/* Community highlight + anchor */}
				<section id="community" className="container mx-auto px-6 mb-12">
					<div className="bg-gradient-to-r from-indigo-50 to-white border rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4">
						<div className="flex-1">
							<h3 className="text-xl font-semibold">Join the Community</h3>
							<p className="text-sm text-gray-600">Connect with learners, ask questions, and share your projects.</p>
						</div>
						<div>
							<a href="#community" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md">Explore Community</a>
						</div>
					</div>
				</section>

				<Community />
			</main>
		</>
	);
}
