"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClient } from "../../../api/client";
import Link from "next/link";
import { StarRating } from "../components/StarRating";
import ChorePageSelector from "../components/ChorePageSelector";

export default function AddItemPage() {
  const client = new ApiClient();
  const router = useRouter();

  // Chore fields
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [selectedPage, setSelectedPage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    if (!selectedPage) {
      alert("Please select a page.");
      return;
    }

    const newItem = {
      title,
      dueDate: dueDate || null,
      description: description.trim() || null,
      difficulty,
      completed: false,
      pageId: selectedPage,
      type: "chores",
    };

    try {
      await client.addChore(newItem);
    } catch (err) {
      console.error("Failed to add chore:", err);
      alert("Failed to add chore");
      return;
    }

    router.push(`/chores?page=${selectedPage}`);
    router.refresh();
  }

  return (
    <>
      <header className="bg-rose-500 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-3xl font-extrabold">
            All Your Chores
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-6 bg-rose-50 rounded-md shadow-md mt-10 text-gray-800">
        <h1 className="text-2xl mb-4 font-semibold">Add New Chore</h1>

        {/* Page Selector */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Select Page</label>
          <ChorePageSelector
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-white border border-gray-300 focus:outline-none focus:border-rose-400"
              required
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block mb-1 font-medium">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 rounded bg-white border border-gray-300 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-white border border-gray-300 focus:outline-none focus:border-rose-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Difficulty</label>
            <StarRating
              rating={difficulty}
              onChange={setDifficulty}
              interactive={true}
              size={50}
            />
            <p className="text-sm text-gray-500 mt-1">
              Click stars to rate difficulty
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
          >
            Add Chore
          </button>
        </form>
      </div>
    </>
  );
}
