"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import {
  downVoteQuestions,
  upVoteQuestions,
} from "@/lib/actions/question.action";
import { upVoteAnswer, downVoteAnswer } from "@/lib/actions/answer.action";
import { usePathname, useRouter } from "next/navigation";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
interface Props {
  type: string;
  itemId: string;
  userId: string;
  upVotes: number;
  hasupVoted: boolean;
  downVotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}
const Votes = ({
  type,
  itemId,
  userId,
  upVotes,
  hasupVoted,
  downVotes,
  hasdownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
  };

  const handleVote = async (action: string) => {
    // console.log("CLICK CLICK");
    if (!userId) {
      return;
    }
    if (action === "upvote") {
      // console.log("DEBUG: hello upVote");
      if (type === "Question") {
        await upVoteQuestions({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
        // console.log("DEBUG: upVote QUESTION");
      } else if (type === "Answer") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }
      //TODO: show a toast message later
      return;
    }

    if (action === "downvote") {
      // console.log("DEBUG: Hello downVote");
      if (type === "Question") {
        await downVoteQuestions({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
        // console.log("DEBUG: downVote QUESTION");
      } else if (type === "Answer") {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }
      //TODO: show a toast message later
      return;
    }
  };

  // React StrictMode for now will make the mounting run twice in development
  // but in production, it should only run and mount once so the views will update by one
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        {/* upVote div here */}
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upVotes)}
            </p>
          </div>
        </div>
        {/* downVote div here */}
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
