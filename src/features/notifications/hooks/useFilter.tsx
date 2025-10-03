import { useMemo, useState } from "react";
import { mockNotifications } from "../data/mock.data";

export type FilterOptions = "all" | "preference" | "posts" | "mentions";
export function useFilter(defaultValue: FilterOptions = "all") {
  const [selectedFilter, setSelectedFilter] =
    useState<FilterOptions>(defaultValue);

  const handleFilterChange = (value: FilterOptions) => {
    setSelectedFilter(value);
    console.log(value);
  };
  const filterNotifications = useMemo(() => {
    if (selectedFilter === "all") return mockNotifications;
    return mockNotifications.filter((n) => n.type === selectedFilter);
  }, [selectedFilter]);
  
  const resetFilter = () => setSelectedFilter(defaultValue);

  return {
    selectedFilter,
    handleFilterChange,
    resetFilter,
    filterNotifications,
  };
}
