import { searchPosts } from "@/lib/api"
import PostCard from "@/components/post-card"
import Pagination from "@/components/pagination"

type searchParams= Promise<{ q: string; page: string }>
type Post = {
  id: string;      // or `number`, depending on your data type
  title: string;
  // add other fields here depending on the properties of `post`
}

export default async function SearchResults({
  searchParams,
}: {
  searchParams: searchParams
}) {

  const resolvedSearchParams = await searchParams;  // Resolving the searchParams promise

  const query = resolvedSearchParams.q || ""
  const currentPage = Number(resolvedSearchParams.page) || 1
  const postsPerPage = 9

  const posts = await searchPosts(query, currentPage, postsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">
        {posts.length === 0 ? `No results found for "${query}"` : `Showing results for "${query}"`}
      </p>

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post:Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No posts found matching your search criteria.</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to home page
          </a>
        </div>
      )}

      {posts.length > 0 && <Pagination totalPages={Math.ceil(posts.length / postsPerPage)} currentPage={currentPage} />}
    </div>
  )
}

// Enable ISR - revalidate content every 60 seconds
export const revalidate = 60

