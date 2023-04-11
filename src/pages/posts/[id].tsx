import { type NextPage } from "next";
import Head from "next/head";
import { PostWithUser } from "..";

const PostView = (props: PostWithUser) => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div>Profile View</div>
      </main>
    </>
  );
};

export default PostView;
