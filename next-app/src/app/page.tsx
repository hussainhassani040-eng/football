import NewsCard from '../components/NewsCard'

const sampleArticles = [
  {
    id: '1',
    title: 'Dramatic late winner secures derby victory',
    excerpt: 'A stunning stoppage-time goal decided the derby as fans erupted.',
    author: 'Jane Doe',
    date: '2026-06-08'
  },
  {
    id: '2',
    title: 'Star striker signs new long-term contract',
    excerpt: 'The club has confirmed the forward will stay for five more years.',
    author: 'John Smith',
    date: '2026-06-07'
  }
]

export default function Home() {
  return (
    <>
      <section className="py-8">
        <h1 className="text-4xl font-bold mb-2">Football News</h1>
        <p className="text-gray-600 mb-6">Latest headlines, match reports, and analysis.</p>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {sampleArticles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      </section>
    </>
  )
}
