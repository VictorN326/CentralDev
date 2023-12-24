import React from "react";
import Question from "@/components/forms/Question";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
const page = async () => {
  // const { userId } = auth();

  const userId = "clrk123";
  if (!userId) {
    redirect("/sign-in");
  }

  const mongodbUser = await getUserById({ userId });

  console.log("DEBUG: mongodbUser: ", mongodbUser);
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
