import React, { useEffect, useState, useRef } from "react";
import { Table } from "../components/table";
import { Layout } from "../components/layout";

export const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const postRef = useRef("");

  useEffect(() => {
    fetch("http://localhost:8030/posts/")
      .then((res) => res.json())
      .then(({ posts }) => setPosts(posts));
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    let data = { url: postRef.current.value };
    console.log(data);
    fetch("http://localhost:8030/posts/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ posts }) => setPosts(posts));
  };
  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8   antialiased sans-serif bg-gray-100 h-screen">
        <div className="px-4 py-6 sm:px-0">
          <Table posts={posts} />

          <form onSubmit={handleSubmit}>
            <div className="my-10">
              <label
                htmlFor="post"
                className="text-sm leading-5 font-medium text-gray-700"
              >
                Instagram Post
              </label>
              <div className="mt-1  ml-4 relative rounded-md shadow-sm inline-block">
                <input
                  id="post"
                  className="form-input  py-2 pl-7 pr-12 sm:text-sm sm:leading-5"
                  type="text"
                  ref={postRef}
                />
              </div>
              <span className="sm:ml-3 shadow-sm rounded-md inline-block">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Scrape
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
