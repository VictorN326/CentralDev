"use client";
import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants/filters";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { formUrlQuery } from "@/lib/utils";
const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");
  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (filter: string) => {
    if (active === filter) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(filter);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: filter.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <Button
            type="button"
            key={filter.value}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize
             dark:text-light-800 dark:hover:text-primary-500
                ${
                  active === filter.value
                    ? "bg-primary-500 text-light-900"
                    : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
                }
             `}
            onClick={() => handleTypeClick(filter.value)}
          >
            {filter.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
