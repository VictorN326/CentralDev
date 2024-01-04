import React from "react";
import LocalSearchBar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { UserFilters } from "@/constants/filters";
import { getAllUser } from "@/lib/actions/user.action";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import Loading from "./loading";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Community | CentralDev",
  description:
    "View all the users in the community that are helping each other to learn and grow. Connect with them and grow together.",
};
const CommunityPage = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUser({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  // const isLoading = true;
  // if (isLoading) return <Loading />;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds 🧠"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result && result.users && result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link className="mt-2 font-bold text-accent-blue" href="/sign-up">
              Join to be the first!
            </Link>
          </div>
        )}
      </section>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result!.isNext}
        />
      </div>
    </>
  );
};

export default CommunityPage;
