import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface PageProps {
  post: Post;
}

const Post = ({ post }: PageProps) => {
  console.log(post)
  const [submitted, SetSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/CreateComment", {
      method: "Post",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log("data submitted!!");
        console.log(data);
        SetSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        SetSubmitted(false);
      });
  };

  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex space-x-2 items-center">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p>
            Blog Post by{" "}
            <span className="text-green-500">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}{" "}
          </p>
        </div>
        <div>
          <PortableText
            projectId="9jce5ftx"
            dataset="production"
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
      {submitted ? (
        <div className="flex flex-col p-10 my-10 
        bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">Thank you for submitting your comments</h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a Comment below</h4>
          <hr className="py-3 mt-4" />
          <input type="hidden" value={post._id} {...register("_id")} />
          <label className="block mb-5">
            <span>Name</span>
            <input
              {...register("name", { required: true })}
              className="shaadow border rounded py-2 px-3 
            form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              type="text"
              placeholder="satish venkatakrishnan"
            />
          </label>
          <label className="block mb-5">
            <span>Email</span>
            <input
              {...register("email", { required: true })}
              className="shaadow border rounded py-2 px-3 
            form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              type="email"
              placeholder="satish1v@gmail.com"
            />
          </label>
          <label className="block mb-5">
            <span>comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shaadow border 
            rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- The name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The Email field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The Comment field is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="shadow bg-yellow-500 
        hover:bg-yellow-400 
        focus:outline-none text-white font-bold py-4 px-4 rounded cursor-pointer"
          />
        </form>
      )}

      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto
      shadow-yellow-500 space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2"/>
        {post.comments.map((comment)=>(
          <div>
            <p>
              <span className="text-yellow-500">{comment.name}:</span>{comment.comment}
            </p>
          </div>
        ))}
      </div>
      
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `
    *[_type == "post"]{
        _id,
        slug
      }
    `;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author ->{
        name,
        image
      },
      'comments': *[_type == "comment" 
                    && post._ref == ^._id
                    && approved == true],
      description,
      mainImage,
        slug,
      body
      }
    `;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
