import { type NextPage } from "next";
import Head from "next/head";

import { RouterOutputs, api } from "@/utils/api";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type Post } from "@prisma/client";
import { User } from "@clerk/nextjs/dist/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { Loading } from "@/components/Loading";

dayjs.extend(relativeTime);

const CreatePost = () => {
  const { user: author } = useUser();

  if (!author) return null;

  return (
    <div className="flex w-full gap-3">
      <Avatar url={author.profileImageUrl} />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = ({ data: { post, author } }: { data: PostWithUser }) => {
  return (
    <div
      key={post.id}
      className="align-center flex gap-3 border-b border-slate-400 p-4"
    >
      <Avatar url={author.profileImage} />
      <div className="flex flex-col">
        <div className="flex gap-1">
          <span>{`${author.username}`}</span>
          <span className="font-thin">{` · ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Avatar = ({ url }: { url: string }) => (
  <Image
    width={50}
    height={50}
    alt="user profile"
    src={url}
    className="h-14 w-14 rounded-full"
  />
);

const Feed = () => {
  const { data, isLoading: postsLoaded } = api.posts.getAll.useQuery();

  if (postsLoaded) return <Loading />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map(({ post, author }) => (
        <PostView key={post.id} data={{ post, author }} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //start fetching posts
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div></div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="h-screen w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn ? <SignInButton /> : <CreatePost />}
          </div>
          <div className="flex flex-col">
            <Feed />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
