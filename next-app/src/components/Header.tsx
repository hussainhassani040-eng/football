import Link from 'next/link'

export default function Header(){
  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">Football News</Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link href="/news" className="text-gray-600 hover:text-gray-900">News</Link>
        </nav>
      </div>
    </header>
  )
}
