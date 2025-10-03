import { useState } from "react";

export type FilterOptions = "all" | "preference" | "posts" | "mentions";
export function useFilter(defaultValue: FilterOptions = "all") {
  const [selectedFilter, setSelectedFilter] =
    useState<FilterOptions>(defaultValue);

  const handleFilterChange = (value: FilterOptions) => {
    setSelectedFilter(value);
    switch (value) {
      case "preference":
        console.log("Show job preferences");
        break;
      case "posts":
        console.log("Show my posts");
        break;
      case "mentions":
        console.log("Show mentions");
        break;
      default:
        console.log("Show all");
    }
  };
  const resetFilter = () => setSelectedFilter(defaultValue);

  return {
    selectedFilter,
    handleFilterChange,
    resetFilter,
  };
}
