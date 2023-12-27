import React from "react";
import Link from "next/link";
import RenderTags from "../shared/Tags";
import Metrics from "../shared/Metrics";
import { getTimeStamp, formatNumber } from "@/lib/utils";
interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upVotes: number;
  answers: Array<Object>;
  views: number;
  createdAt: Date;
}
const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upVotes,
  answers,
  views,
  createdAt,
}: QuestionProps) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        {/* timeStamp div below */}
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* if signed in, add edit delete actions on the card */}
      </div>
      {/* rendered tag div goes below */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTags key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metrics
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />

        <Metrics
          imgUrl="/assets/icons/like.svg"
          alt="UpVotes"
          value={formatNumber(upVotes)}
          title="Votes"
          textStyles="small-medium text-dark400_light800"
        />

        <Metrics
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(answers.length)}
          title={`${answers.length > 1 ? "Answers" : "Answer"} `}
          textStyles="small-medium text-dark400_light800"
        />

        <Metrics
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatNumber(views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
