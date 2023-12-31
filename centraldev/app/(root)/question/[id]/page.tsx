import Answer from "@/components/forms/Answer";
import Metrics from "@/components/shared/Metrics";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTags from "@/components/shared/Tags";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswer from "@/components/shared/AllAnswer";
import Votes from "@/components/shared/Votes";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Question | CentralDev",
  description:
    "View the question and answers. You can also answer the question and help others and upVote and downVote the question and answers.",
};
const Page = async ({ params, searchParams }: any) => {
  const result = await getQuestionById({ questionId: params.id });
  // console.log("DEBUG: RESULT: ", result);
  const { userId: clerkId } = auth();
  let mongoDBUser;
  if (clerkId) {
    mongoDBUser = await getUserById({ userId: clerkId });
  }
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoDBUser._id)}
              upVotes={result.upVotes.length}
              hasupVoted={result.upVotes.includes(mongoDBUser._id)}
              downVotes={result.downVotes.length}
              hasdownVoted={result.downVotes.includes(mongoDBUser._id)}
              hasSaved={mongoDBUser?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metrics
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(result.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metrics
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metrics
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTags
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <AllAnswer
        questionId={result._id}
        userId={mongoDBUser._id}
        totalAnswers={result.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />
      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoDBUser._id)}
      />
    </>
  );
};

export default Page;
