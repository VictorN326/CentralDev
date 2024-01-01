import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import React from "react";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearchBar from "@/components/shared/search/LocalSearchbar";
import { IQuestion } from "@/database/question.model";
import Pagination from "@/components/shared/Pagination";
import { URLProps } from "@/types";
const TagDetails = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  });

  // console.log("DEBUG: result: ", result);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result?.tagTitle}</h1>

      <div className="mt-11 w-full ">
        <LocalSearchBar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result && result.questions && result.questions.length > 0 ? (
          result.questions.map((question: IQuestion) => (
            //TODO: Fix the types for tag, author, and upVotes later due to IQuestion type
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              //@ts-ignore
              tags={question.tags}
              //@ts-ignore
              author={question.author}
              //@ts-ignore
              upVotes={question.upVotes}
              answers={question.answers}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title=" There's no saved questions to show"
            description="Take the first step to ask question and breaking the silence! 🚀 Ask a question and start off the discussion. Our query could be the next big thing others could learn from. Get involved now! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result!.isNext}
        />
      </div>
    </>
  );
};

export default TagDetails;
