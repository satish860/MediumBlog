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
