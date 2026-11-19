"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const selectClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

type FilterValues = {
  search: string;
  category: string;
  serviceMode: string;
  sort: string;
};

export function ServicesFilter({
  initialSearch,
  initialCategory,
  initialServiceMode,
  initialSort,
}: {
  initialSearch: string;
  initialCategory: string;
  initialServiceMode: string;
  initialSort: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [serviceMode, setServiceMode] = useState(initialServiceMode);
  const [sort, setSort] = useState(initialSort);

  const pushFilters = (values: FilterValues) => {
    const params = new URLSearchParams();
    if (values.search) params.set("search", values.search);
    if (values.category) params.set("category", values.category);
    if (values.serviceMode) params.set("serviceMode", values.serviceMode);
    if (values.sort) params.set("sort", values.sort);
    const query = params.toString();
    router.push(query ? `/services?${query}` : "/services");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushFilters({ search, category, serviceMode, sort });
  };

  const handleClear = () => {
    setSearch("");
    setCategory("");
    setServiceMode("");
    setSort("newest");
    router.push("/services");
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category"
              className="pl-9"
            />
          </div>
          <Button type="submit" className="bg-[rgb(249,115,22)] text-white hover:bg-[rgb(234,88,12)]">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              pushFilters({ search, category: e.target.value, serviceMode, sort });
            }}
            className={selectClass}
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={serviceMode}
            onChange={(e) => {
              setServiceMode(e.target.value);
              pushFilters({ search, category, serviceMode: e.target.value, sort });
            }}
            className={selectClass}
          >
            <option value="">All Modes</option>
            <option value="Home Visit">Home Visit</option>
            <option value="Shop Drop-off">Shop Drop-off</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              pushFilters({ search, category, serviceMode, sort: e.target.value });
            }}
            className={selectClass}
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-zinc-500 hover:text-[rgb(249,115,22)] dark:text-zinc-400"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
