import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchBar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
const questions = [
  {
    _id: "1",
    title: "What is the difference between Tailwind CSS and Bootstrap?",
    tags: [
      { _id: "1", name: "Tailwind CSS" },
      { _id: "2", name: "Bootstrap" },
    ],
    author: {
      _id: "a1",
      name: "John Doe",
      picture: "https://example.com/picture1.jpg",
    },
    upVotes: 234567,
    answers: [],
    views: 1234567,
    createdAt: new Date("2023-12-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div?",
    tags: [
      { _id: "3", name: "CSS" },
      { _id: "4", name: "web development" },
    ],
    author: {
      _id: "a2",
      name: "Jane Doe",
      picture: "https://example.com/picture2.jpg",
    },
    upVotes: 5678,
    answers: [],
    views: 234567,
    createdAt: new Date("2022-12-01T12:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upVotes={question.upVotes}
              answers={question.answers}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title=" There's no question to show"
            description="Take the first step to ask question and breaking the silence! 🚀 Ask a question and start off the discussion. Our query could be the next big thing others could learn from. Get involved now! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
