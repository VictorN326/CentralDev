import React from "react";
import Question from "@/components/forms/Question";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Ask a question | CentralDev",
  description:
    "Ask a question to the community and get answers from the amazing minds. You can also help others by answering their questions.",
};
const page = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const mongodbUser = await getUserById({ userId });

  // console.log("DEBUG: mongodbUser: ", mongodbUser);
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongodbUserId={JSON.stringify(mongodbUser._id)} />
      </div>
    </div>
  );
};

export default page;
