import React, { useMemo, useState } from 'react';

type Post = {
	id: number;
	author: string;
	avatar?: string;
	time: string;
	content: string;
	topic: string;
	likes: number;
	comments: number;
};

const sampleTopics = ['Introductions', 'Projects', 'Career', 'Design', 'Frontend', 'Data'];
const samplePosts: Post[] = [
	{ id: 1, author: 'Laura P.', time: '2h', content: "Just finished the React course — here's my small project!", topic: 'Projects', likes: 8, comments: 3 },
	{ id: 2, author: 'Mark D.', time: '1d', content: 'What are good resources to learn data visualization?', topic: 'Data', likes: 5, comments: 4 },
	{ id: 3, author: 'Ana S.', time: '3d', content: "Looking for teammates for a design system challenge.", topic: 'Design', likes: 12, comments: 6 },
];

export default function Community() {
	const [search, setSearch] = useState('');
	const [topicFilter, setTopicFilter] = useState<'all' | string>('all');
	const [liked, setLiked] = useState<Record<number, boolean>>({});

	const posts = useMemo(() => {
		return samplePosts.filter(p => {
			const matchesSearch = !search || `${p.author} ${p.content}`.toLowerCase().includes(search.toLowerCase());
			const matchesTopic = topicFilter === 'all' || p.topic === topicFilter;
			return matchesSearch && matchesTopic;
		});
	}, [search, topicFilter]);

	const toggleLike = (id: number) => {
		setLiked(prev => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<section id="community" role="region" aria-labelledby="community-heading" className="container mx-auto px-6 py-12">
			<div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 id="community-heading" className="text-2xl font-semibold">Community</h2>
					<p className="text-sm text-gray-500">Connect with learners, ask questions, and share projects.</p>
				</div>

				<div className="flex items-center gap-3">
					<label htmlFor="community-search" className="sr-only">Search community</label>
					<input
						id="community-search"
						type="search"
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search posts, people or topics..."
						className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring"
						aria-label="Search community"
					/>
					<button className="bg-primary text-white px-4 py-2 rounded-md shadow-sm">New Post</button>
				</div>
			</div>

			{/* topic chips */}
			<div className="mb-6 flex flex-wrap gap-2">
				<button
					className={`px-3 py-1 rounded-full text-sm ${topicFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
					onClick={() => setTopicFilter('all')}
				>
					All
				</button>
				{sampleTopics.map(t => (
					<button
						key={t}
						onClick={() => setTopicFilter(t)}
						className={`px-3 py-1 rounded-full text-sm ${topicFilter === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
					>
						{t}
					</button>
				))}
				{(search || topicFilter !== 'all') && (
					<button
						onClick={() => {
							setSearch('');
							setTopicFilter('all');
						}}
						className="ml-2 px-3 py-1 rounded-full text-sm bg-white border text-gray-600"
					>
						Clear
					</button>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* feed */}
				<div className="lg:col-span-2 space-y-4">
					{posts.length > 0 ? (
						posts.map(p => (
							<article key={p.id} className="bg-white border rounded-lg p-4 shadow-sm">
								<header className="flex items-start gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-dark font-semibold">
										{p.author.split(' ').map(s => s[0]).slice(0, 2).join('')}
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<div>
												<div className="font-medium">{p.author}</div>
												<div className="text-xs text-gray-400">{p.time} • {p.topic}</div>
											</div>
										</div>
										<p className="mt-3 text-gray-800">{p.content}</p>
										<div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
											<button
												type="button"
												onClick={() => toggleLike(p.id)}
												className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50"
												aria-pressed={!!liked[p.id]}
											>
												<span className={`text-lg ${liked[p.id] ? 'text-red-500' : 'text-gray-400'}`}>♥</span>
												<span>{p.likes + (liked[p.id] ? 1 : 0)}</span>
											</button>
											<span className="flex items-center gap-2 px-2 py-1 rounded-md">
												💬 <span>{p.comments}</span>
											</span>
										</div>
									</div>
								</header>
							</article>
						))
					) : (
						<div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-200">
							<div className="text-4xl mb-4">🙌</div>
							<h3 className="text-xl font-semibold mb-2">No posts yet</h3>
							<p className="text-gray-500 mb-6">Be the first to start a conversation in this community.</p>
							<button className="px-4 py-2 bg-primary text-white rounded-md">Create a post</button>
						</div>
					)}
				</div>

				{/* sidebar */}
				<aside className="space-y-6">
					<div className="bg-white border rounded-lg p-4">
						<h4 className="font-semibold mb-3">Trending topics</h4>
						<div className="flex flex-wrap gap-2">
							{sampleTopics.map(t => (
								<button
									key={t}
									onClick={() => setTopicFilter(t)}
									className={`px-3 py-1 rounded-md text-sm ${topicFilter === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
								>
									{t}
								</button>
							))}
						</div>
					</div>

					<div className="bg-white border rounded-lg p-4 text-center">
						<h4 className="font-semibold">Join the community</h4>
						<p className="text-sm text-gray-500 mb-4">Get notified about events and connect with peers.</p>
						<button className="px-4 py-2 bg-primary text-white rounded-md">Join group</button>
					</div>

					<div className="bg-white border rounded-lg p-4">
						<h4 className="font-semibold mb-3">Top contributors</h4>
						<ul className="space-y-3 text-sm text-gray-700">
							<li className="flex items-center justify-between"><span>Laura P.</span><span className="text-gray-400">12 posts</span></li>
							<li className="flex items-center justify-between"><span>Ana S.</span><span className="text-gray-400">9 posts</span></li>
							<li className="flex items-center justify-between"><span>Mark D.</span><span className="text-gray-400">7 posts</span></li>
						</ul>
					</div>
				</aside>
			</div>
		</section>
	);
}
