import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Edit Question | CentralDev",
  description:
    "Edit your question and make it more clear and understandable to the community and get more answers.",
};
const EditAction = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongodbUserId = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          mongodbUserId={mongodbUserId}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default EditAction;
