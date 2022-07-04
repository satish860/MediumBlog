import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Index from "../components/Index";
import { sanityClient } from "../sanity";
import { Post } from "../typings";

interface PostProps {
  posts: [Post];
}

const Home: NextPage<PostProps> = ({ posts }: PostProps) => {
  return (
    <div className="">
      <Head>
        <title>Medium</title>
        <link rel="icon" href="/favicon.ico" />
        <title>Medium Clone</title>
        <meta name="title" content="Medium Clone" />
        <meta
          name="description"
          content="A Clone of Medium using NextJs and Sanity from Satish Venkatakrishnan"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://medium-blog-iota.vercel.app/"
        />
        <meta property="og:title" content="Medium Clone" />
        <meta
          property="og:description"
          content="A Clone of Medium using NextJs and Sanity from Satish Venkatakrishnan"
        />
        <meta
          property="og:image"
          content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://medium-blog-iota.vercel.app/"
        />
        <meta property="twitter:title" content="Medium Clone" />
        <meta
          property="twitter:description"
          content="A Clone of Medium using NextJs and Sanity from Satish Venkatakrishnan"
        />
        <meta
          property="twitter:image"
          content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
        />
      </Head>

      <Header />
      <Index posts={posts} />
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const query = `
  *[_type == "post"]{
    _id,
    title,
    author ->{
    name,
    image
  },
    description,
    mainImage,
    slug
  }
  `;
  const initialPosts = await sanityClient.fetch(query);
  return {
    props: {
      posts: initialPosts,
    },
  };
};
