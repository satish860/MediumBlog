import Link from "next/link";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

const Index = ({ posts }: Props) => {
  console.log(posts);
  return (
    <div>
      <div
        className="flex justify-between items-center
     bg-yellow-600 border-y border-black py-10 lg:py-0 max-w-7xl p-5 mx-auto"
      >
        <div className="px-10 space-y-10">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-black decortion-4">
              Medium
            </span>{" "}
            is a place to write,read, and connect
          </h1>
          <h2>
            it's easy and free to post your thinking on any topic and connect
            with millions of readers
          </h2>
        </div>

        <img
          className="hidden md:inline-flex h-32 lg:h-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
        />
      </div>
      <div className="grid grid-cols-1 
      sm:grid-cols-2 lg:grid-cols-3 
      gap-3 md:gap-6 ml-24 p-5 max-w-7xl">
        {posts.map((post) => {
          return (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="group border rounded-lg cursor-pointer overflow-hidden">
                <div>
                  <img
                  className="h-60 w-full object-cover 
                  group-hover:scale-105
                  transition-transform duration-200 ease-in-out"
                    src={urlFor(post.mainImage).url()!}
                    alt="Post Main Image"
                  />
                </div>
                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <p className = "text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <img
                    className="h-12 w-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt={post.author.name}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
