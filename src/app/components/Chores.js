"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ChorePageSelector from "@/app/components/ChorePageSelector";
import ViewToggle from "@/app/components/ViewToggle";
import StatusFilter from "@/app/components/StatusFilter";
import ItemCard from "@/app/components/ItemCard";
import AddItemButton from "@/app/components/AddItemButton";
import axios from "axios";

export default function MainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromQuery = searchParams.get("page");

  const [items, setItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(pageFromQuery || "");

  const [viewMode, setViewMode] = useState("chores");
  const [filter, setFilter] = useState("notCompleted");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    async function fetchPages() {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await axios.get("https://divide-and-conquer-backend-2.onrender.com/api/pages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPages(res.data);

        if (!selectedPage && res.data.length > 0) {
          setSelectedPage(res.data[0]._id.toString());
        }
      } catch (err) {
        console.error("Failed to fetch pages:", err);
      }
    }

    fetchPages();
  }, []);

  useEffect(() => {
    if (!selectedPage) {
      setItems([]);
      return;
    }

    async function fetchChores() {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await axios.get(`https://divide-and-conquer-backend-2.onrender.com/api/chores?pageId=${selectedPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch chores:", err);
        setItems([]);
      }
    }

    fetchChores();
  }, [selectedPage]);

  const toggleCompleted = async (id, currentCompleted) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await axios.put(
        `https://divide-and-conquer-backend-2.onrender.com/api/chores/${id}`,
        { completed: !currentCompleted },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, completed: res.data.completed } : item
        )
      );
    } catch (err) {
      console.error("Failed to toggle completed:", err);
      alert("Could not update chore status.");
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await axios.delete(`https://divide-and-conquer-backend-2.onrender.com/api/chores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete chore.");
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.pageId?.toString() === selectedPage.toString() &&
      (filter === "all" ||
        (filter === "completed" && item.completed) ||
        (filter === "notCompleted" && !item.completed))
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  function handleAddItem() {
    router.push("/additem");
  }

  function handleNewPage() {
    router.push("/newpage");
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Top Panel */}
      <div className="border-2 border-rose-800 rounded-md p-4 mb-3 bg-emerald-900 shadow-sm">
        {/* Dropdown + New Page Button */}
        <div className="flex items-center mb-4">
          <ChorePageSelector
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pages={pages}
          />
          <button
            onClick={handleNewPage}
            className="ml-3 px-4 py-1 bg-rose-700 text-white rounded-md hover:bg-emerald-500 transition"
          >
            New Page
          </button>
        </div>

        {/* View Toggle + Status Filter */}
        <div className="flex justify-between items-center gap-4">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          <StatusFilter filter={filter} setFilter={setFilter} />
        </div>
      </div>

      {/* Add Item Button */}
      <div className="relative mb-6">
        <div className="absolute left-1/2 -translate-x-1/2">
          <AddItemButton onClick={handleAddItem} />
        </div>

        {/* Sort By Dropdown */}
        <div className="flex justify-end">
          <div className="border border-gray-500 rounded bg-emerald-900 px-4 py-2 text-white shadow-sm">
            <label className="mr-2 font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-emerald-800 border border-gray-600 text-white px-2 py-1 rounded"
            >
              <option value="recent">Most Recent</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      {sortedItems.length === 0 ? (
        <p className="text-center text-emerald-400">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {sortedItems.map((item) => (
            <ItemCard
              key={item._id}
              {...item}
              onToggleCompleted={() => toggleCompleted(item._id, item.completed)}
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
