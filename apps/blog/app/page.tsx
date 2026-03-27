import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default async function BlogIndex() {
  const postsDirectory = path.join(process.cwd(), "content/blog");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    return {
      slug: filename.replace(/\.mdx?$/, ""),
      title: data.title,
      date: data.date,
      description: data.description,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8">
        Ozigi Blog
      </h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-slate-200 pb-6">
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-2xl font-bold group-hover:text-brand-red transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-500 text-sm mt-1">{post.date}</p>
              <p className="text-slate-600 mt-2">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}