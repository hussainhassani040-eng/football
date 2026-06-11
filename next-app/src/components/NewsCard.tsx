type Article = {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
}

export default function NewsCard({ article }: { article: Article }){
  return (
    <article className="bg-white p-5 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
      <p className="text-gray-600 mb-3">{article.excerpt}</p>
      <div className="text-xs text-gray-500">By {article.author} · {article.date}</div>
    </article>
  )
}
